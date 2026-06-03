#![no_std]
use soroban_sdk::{contract, contractevent, contractimpl, symbol_short, Address, Env, Symbol};

const YES_KEY: Symbol = symbol_short!("YES");
const NO_KEY: Symbol = symbol_short!("NO");

#[contractevent]
pub struct VoteEvent {
    pub voter: Address,
    pub choice: Symbol,
    pub yes_total: u32,
    pub no_total: u32,
}

#[contract]
pub struct LivePollContract;

#[contractimpl]
impl LivePollContract {
    pub fn vote(env: Env, voter: Address, choice: Symbol) -> (u32, u32) {
        voter.require_auth();

        if env.storage().persistent().has(&voter) {
            panic!("Account has already cast a vote in this poll.");
        }

        if choice != YES_KEY && choice != NO_KEY {
            panic!("Invalid choice selection. Must match either Symbol 'YES' or 'NO'.");
        }

        let mut yes_count: u32 = env.storage().instance().get(&YES_KEY).unwrap_or(0);
        let mut no_count: u32 = env.storage().instance().get(&NO_KEY).unwrap_or(0);

        if choice == YES_KEY {
            yes_count += 1;
            env.storage().instance().set(&YES_KEY, &yes_count);
        } else {
            no_count += 1;
            env.storage().instance().set(&NO_KEY, &no_count);
        }

        env.storage().persistent().set(&voter, &true);

        VoteEvent {
            voter: voter.clone(),
            choice,
            yes_total: yes_count,
            no_total: no_count,
        }
        .publish(&env);

        (yes_count, no_count)
    }

    pub fn get_scores(env: Env) -> (u32, u32) {
        let yes_count: u32 = env.storage().instance().get(&YES_KEY).unwrap_or(0);
        let no_count: u32 = env.storage().instance().get(&NO_KEY).unwrap_or(0);
        (yes_count, no_count)
    }

    pub fn has_voted(env: Env, voter: Address) -> bool {
        env.storage().persistent().has(&voter)
    }
}

mod test;
