"use client";

import { useState } from "react";
import { usePoll } from "@/context/PollContext";
import WalletModal from "@/components/WalletModal";
import VotePanel from "@/components/VotePanel";
import TransactionAlert from "@/components/TransactionAlert";

export default function Home() {
  const {
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
    resetTx,
  } = usePoll();

  const [modalOpen, setModalOpen] = useState(false);
  const isPending = txStatus === "pending";

  const handleConnectClick = () => {
    setModalOpen(true);
  };

  const handleModalConnect = (addr: string) => {
    handleConnected(addr);
    setModalOpen(false);
  };

  const handleVoteYes = async () => {
    await vote("YES");
  };

  const handleVoteNo = async () => {
    await vote("NO");
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Live Poll
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Soroban Smart Contract &bull; Stellar Testnet
          </p>
        </div>

        {address ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Wallet Connected
                  </p>
                  <p className="font-mono text-sm text-green-600">
                    {address.slice(0, 4)}...{address.slice(-4)}
                  </p>
                </div>
              </div>
              <button
                onClick={disconnectWallet}
                disabled={isPending}
                className="rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleConnectClick}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Connect Wallet to Vote
          </button>
        )}

        {address && (
          <VotePanel
            pollState={pollState}
            hasVoted={hasVoted}
            txStatus={txStatus}
            onVoteYes={handleVoteYes}
            onVoteNo={handleVoteNo}
          />
        )}

        <TransactionAlert
          status={
            txStatus === "success"
              ? "success"
              : txStatus === "failure"
                ? "failure"
                : null
          }
          hash={txHash}
          error={txError}
          explorerUrl={explorerUrl}
          onDismiss={resetTx}
        />

        <WalletModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConnect={handleModalConnect}
        />
      </div>
    </main>
  );
}
