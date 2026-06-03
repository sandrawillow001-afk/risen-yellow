import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBZ3EVHB4CXCMEDPURY2DGEJK3QYXA4QV3MD2GL7F7E5T5G47XXPIV5E",
  }
} as const


export interface Client {
  /**
   * Construct and simulate a vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  vote: ({voter, choice}: {voter: string, choice: string}, options?: MethodOptions) => Promise<AssembledTransaction<readonly [u32, u32]>>

  /**
   * Construct and simulate a has_voted transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  has_voted: ({voter}: {voter: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_scores transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_scores: (options?: MethodOptions) => Promise<AssembledTransaction<readonly [u32, u32]>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABQAAAAAAAAAAAAAACVZvdGVFdmVudAAAAAAAAAEAAAAKdm90ZV9ldmVudAAAAAAABAAAAAAAAAAFdm90ZXIAAAAAAAATAAAAAAAAAAAAAAAGY2hvaWNlAAAAAAARAAAAAAAAAAAAAAAJeWVzX3RvdGFsAAAAAAAABAAAAAAAAAAAAAAACG5vX3RvdGFsAAAABAAAAAAAAAAC",
        "AAAAAAAAAAAAAAAEdm90ZQAAAAIAAAAAAAAABXZvdGVyAAAAAAAAEwAAAAAAAAAGY2hvaWNlAAAAAAARAAAAAQAAA+0AAAACAAAABAAAAAQ=",
        "AAAAAAAAAAAAAAAJaGFzX3ZvdGVkAAAAAAAAAQAAAAAAAAAFdm90ZXIAAAAAAAATAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAKZ2V0X3Njb3JlcwAAAAAAAAAAAAEAAAPtAAAAAgAAAAQAAAAE" ]),
      options
    )
  }
  public readonly fromJSON = {
    vote: this.txFromJSON<readonly [u32, u32]>,
        has_voted: this.txFromJSON<boolean>,
        get_scores: this.txFromJSON<readonly [u32, u32]>
  }
}