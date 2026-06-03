# 🗳️ Soroban Real-Time Live Poll (Yellow Belt)

A production-grade, full-stack Stellar Testnet dApp utilizing decentralized WebAssembly (WASM) smart contracts, multi-wallet coordination wrappers, and real-time ledger synchronization layers. Built for the **Level 2 – Yellow Belt Challenge** in the Stellar Journey to Mastery Program.

---

## 🚀 Live Implementation Profiles
- **Developer Profile:** Jerome Onoja ([@jerryidoko](https://github.com/jerryidoko))
- **Repository Track:** `stellar-yellow-belt-poll`
- **Target Network Environment:** Stellar Testnet

### 🔗 Deployed Smart Contract Infrastructure
- **On-Chain Soroban Contract ID:** `CBZ3EVHB4CXCMEDPURY2DGEJK3QYXA4QV3MD2GL7F7E5T5G47XXPIV5E`
- **Verified Transaction Call Hash:** `d496e68cbb252d325dc6592ecd8c26731884fbabe01feb11ab70799172a354ae`
- **Verifiable Ledger Explorer link:** [Click to view live Contract Call on Stellar.Expert](https://stellar.expert/explorer/testnet/tx/d496e68cbb252d325dc6592ecd8c26731884fbabe01feb11ab70799172a354ae)

---

## 🛠️ Deep Architectural Breakdown

1. **Multi-Wallet Orchestration Kit:**
   - Swapped out hardcoded browser extension scripts for a flexible `@creit.tech/stellar-wallets-kit` engine.
   - Provides users with an intuitive, unified modal drawer supporting **Freighter, xBull, and Albedo** credentials seamlessly.

2. **On-Chain Soroban Engine (`src/lib.rs`):**
   - Written in safe, isolated Rust compiled directly into highly performant WASM logic bytecode (2,159 bytes).
   - Enforces single-vote constraints per account signature via isolated `persistent` ledger registers to prevent double-voting.
   - Fires structural custom typed events (`VoteEvent`) back into the network cluster whenever storage modifications clear validation rules.

3. **3-Tier Defensive Exception Trap Hooks:**
   - **WalletNotFound:** Gracefully intercepts calls when an uninstalled extension target is picked, alerting the client workspace.
   - **UserRejectedTransaction:** Catching block structures that capture signature cancellations cleanly.
   - **InsufficientFUNDS:** Checks the active balance layer prior to gas estimation pipelines to ensure the caller has adequate testnet reserves.

4. **Real-Time Data Sync & State Polling:**
   - Integrated with background routines tracking changes via type-safe `@stellar/stellar-sdk` connections.
   - Features automated polling updates querying `client.get_scores()` to ensure data integrity without refreshing the user workspace.

---

## ⚙️ Quickstart Manual

1. **Clone & Target Workspace:**
```bash
   git clone https://github.com/jerryidoko/stellar-yellow-belt-poll.git
   cd stellar-yellow-belt-poll
```

2. **Install Dependencies:**
```bash
   npm install
```

3. **Run the Development Server:**
```bash
   npm run dev
```

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

> **Prerequisite:** Ensure at least one supported wallet extension (Freighter, xBull, or Albedo) is installed and configured to connect to the **Stellar Testnet**.

---

## 📄 License

This project is submitted as part of the **Stellar Journey to Mastery Program** and is open-sourced under the MIT License.
