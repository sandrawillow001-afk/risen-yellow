"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { Networks } from "@creit.tech/stellar-wallets-kit/types";
import { FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { xBullModule } from "@creit.tech/stellar-wallets-kit/modules/xbull";
import { AlbedoModule } from "@creit.tech/stellar-wallets-kit/modules/albedo";
import { Client } from "@/contracts/poll-client";
import { UserRejectedTransaction, InsufficientFUNDS } from "@/utils/errors";

const MODULES = [new FreighterModule(), new xBullModule(), new AlbedoModule()];

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK = "Test SDF Network ; September 2015";
const CONTRACT_ID = "CBZ3EVHB4CXCMEDPURY2DGEJK3QYXA4QV3MD2GL7F7E5T5G47XXPIV5E";

export interface PollState {
  yesVotes: number;
  noVotes: number;
}

export type TxStatus = "idle" | "pending" | "success" | "failure";

export interface PollContextValue {
  address: string | null;
  handleConnected: (addr: string) => void;
  disconnectWallet: () => void;
  pollState: PollState;
  txStatus: TxStatus;
  txHash: string | null;
  txError: string | null;
  explorerUrl: string | null;
  hasVoted: boolean;
  vote: (choice: "YES" | "NO") => Promise<void>;
  refreshScores: () => Promise<void>;
  resetTx: () => void;
}

const PollContext = createContext<PollContextValue | null>(null);
const STELLAR_EXPERT_TX = "https://stellar.expert/explorer/testnet/tx";

export function PollProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [pollState, setPollState] = useState<PollState>({
    yesVotes: 0,
    noVotes: 0,
  });
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const kitInitRef = useRef(false);

  async function refreshScores() {
    const client = clientRef.current;
    if (!client) return;
    try {
      const { result } = await client.get_scores();
      setPollState({ yesVotes: Number(result[0]), noVotes: Number(result[1]) });
    } catch {
    }
  }

  async function checkHasVoted(addr: string) {
    const client = clientRef.current;
    if (!client) return;
    try {
      const { result } = await client.has_voted({ voter: addr });
      setHasVoted(result);
    } catch {
    }
  }

  useEffect(() => {
    if (kitInitRef.current) return;
    kitInitRef.current = true;
    StellarWalletsKit.init({
      modules: MODULES,
      network: Networks.TESTNET,
    });
  }, []);

  useEffect(() => {
    if (!address) {
      clientRef.current = null;
      return;
    }

    const client = new Client({
      contractId: CONTRACT_ID,
      networkPassphrase: NETWORK,
      rpcUrl: RPC_URL,
      publicKey: address,
      signTransaction: (xdr: string, opts?: { networkPassphrase?: string; address?: string }) =>
        StellarWalletsKit.signTransaction(xdr, {
          networkPassphrase: opts?.networkPassphrase,
          address: opts?.address,
        }),
    });

    clientRef.current = client;
    refreshScores();
    checkHasVoted(address);
  }, [address]);

  const handleConnected = useCallback((addr: string) => {
    setAddress(addr);
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      await StellarWalletsKit.disconnect();
    } catch {
    }
    setAddress(null);
    setPollState({ yesVotes: 0, noVotes: 0 });
    setTxStatus("idle");
    setTxHash(null);
    setTxError(null);
    setHasVoted(false);
  }, []);

  const resetTx = useCallback(() => {
    setTxStatus("idle");
    setTxHash(null);
    setTxError(null);
  }, []);

  const vote = useCallback(
    async (choice: "YES" | "NO") => {
      const client = clientRef.current;
      if (!client || !address) {
        throw new Error("Wallet not connected");
      }

      setTxStatus("pending");
      setTxHash(null);
      setTxError(null);

      try {
        const tx = await client.vote({ voter: address, choice });

        const sent = await tx.signAndSend();
        const hash = sent.sendTransactionResponse?.hash;

        if (!hash) {
          throw new Error("No transaction hash returned");
        }

        setTxHash(hash);
        setTxStatus("success");
        setHasVoted(true);
        await refreshScores();
      } catch (err: unknown) {
        let mapped: Error;

        if (err instanceof Error) {
          const msg = err.message.toLowerCase();

          if (
            msg.includes("user declined") ||
            msg.includes("cancel") ||
            msg.includes("reject") ||
            msg.includes("UserRejected")
          ) {
            mapped = new UserRejectedTransaction();
          } else if (
            msg.includes("insufficient") ||
            msg.includes("budget") ||
            msg.includes("fee") ||
            msg.includes("could not be funded")
          ) {
            const required = "~0.01 XLM";
            const available = "0 XLM";
            mapped = new InsufficientFUNDS(required, available);
          } else {
            mapped = err;
          }
        } else {
          mapped = new Error("An unknown error occurred");
        }

        setTxStatus("failure");
        setTxError(mapped.message);
      }
    },
    [address]
  );

  const explorerUrl = txHash ? `${STELLAR_EXPERT_TX}/${txHash}` : null;

  return (
    <PollContext.Provider
      value={{
        address,
        handleConnected,
        disconnectWallet,
        pollState,
        txStatus,
        txHash,
        txError,
        explorerUrl,
        hasVoted,
        vote,
        refreshScores,
        resetTx,
      }}
    >
      {children}
    </PollContext.Provider>
  );
}

export function usePoll(): PollContextValue {
  const ctx = useContext(PollContext);
  if (!ctx) {
    throw new Error("usePoll must be used within a PollProvider");
  }
  return ctx;
}
