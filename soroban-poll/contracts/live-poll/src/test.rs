#![cfg(test)]

use super::*;
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, MockAuth, MockAuthInvoke},
    IntoVal,
};

#[test]
fn test_vote_yes() {
    let env = Env::default();
    let contract_id = env.register(LivePollContract, ());
    let client = LivePollContractClient::new(&env, &contract_id);

    let voter = Address::generate(&env);
    let choice = symbol_short!("YES");

    let invoke = MockAuthInvoke {
        contract: &contract_id,
        fn_name: "vote",
        args: (voter.clone(), choice.clone()).into_val(&env),
        sub_invokes: &[],
    };

    let (yes, no) = client
        .mock_auths(&[MockAuth {
            address: &voter,
            invoke: &invoke,
        }])
        .vote(&voter, &choice);
    assert_eq!(yes, 1);
    assert_eq!(no, 0);

    let scores = client.get_scores();
    assert_eq!(scores, (1, 0));
}

#[test]
fn test_vote_no() {
    let env = Env::default();
    let contract_id = env.register(LivePollContract, ());
    let client = LivePollContractClient::new(&env, &contract_id);

    let voter = Address::generate(&env);
    let choice = symbol_short!("NO");

    let invoke = MockAuthInvoke {
        contract: &contract_id,
        fn_name: "vote",
        args: (voter.clone(), choice.clone()).into_val(&env),
        sub_invokes: &[],
    };

    let (yes, no) = client
        .mock_auths(&[MockAuth {
            address: &voter,
            invoke: &invoke,
        }])
        .vote(&voter, &choice);
    assert_eq!(yes, 0);
    assert_eq!(no, 1);
}

#[test]
fn test_multiple_voters() {
    let env = Env::default();
    let contract_id = env.register(LivePollContract, ());
    let client = LivePollContractClient::new(&env, &contract_id);

    let alice = Address::generate(&env);
    let bob = Address::generate(&env);
    let choice = symbol_short!("YES");

    let invoke_a = MockAuthInvoke {
        contract: &contract_id,
        fn_name: "vote",
        args: (alice.clone(), choice.clone()).into_val(&env),
        sub_invokes: &[],
    };
    client
        .mock_auths(&[MockAuth {
            address: &alice,
            invoke: &invoke_a,
        }])
        .vote(&alice, &choice);

    let invoke_b = MockAuthInvoke {
        contract: &contract_id,
        fn_name: "vote",
        args: (bob.clone(), choice.clone()).into_val(&env),
        sub_invokes: &[],
    };
    client
        .mock_auths(&[MockAuth {
            address: &bob,
            invoke: &invoke_b,
        }])
        .vote(&bob, &choice);

    let (y, n) = client.get_scores();
    assert_eq!(y, 2);
    assert_eq!(n, 0);
}

#[test]
fn test_has_voted() {
    let env = Env::default();
    let contract_id = env.register(LivePollContract, ());
    let client = LivePollContractClient::new(&env, &contract_id);

    let voter = Address::generate(&env);
    let choice = symbol_short!("YES");

    assert!(!client.has_voted(&voter));

    let invoke = MockAuthInvoke {
        contract: &contract_id,
        fn_name: "vote",
        args: (voter.clone(), choice.clone()).into_val(&env),
        sub_invokes: &[],
    };
    client
        .mock_auths(&[MockAuth {
            address: &voter,
            invoke: &invoke,
        }])
        .vote(&voter, &choice);

    assert!(client.has_voted(&voter));
}

#[test]
#[should_panic(expected = "Account has already cast a vote in this poll.")]
fn test_double_vote_panics() {
    let env = Env::default();
    let contract_id = env.register(LivePollContract, ());
    let client = LivePollContractClient::new(&env, &contract_id);

    let voter = Address::generate(&env);
    let yes = symbol_short!("YES");
    let no = symbol_short!("NO");

    let invoke_yes = MockAuthInvoke {
        contract: &contract_id,
        fn_name: "vote",
        args: (voter.clone(), yes.clone()).into_val(&env),
        sub_invokes: &[],
    };
    client
        .mock_auths(&[MockAuth {
            address: &voter,
            invoke: &invoke_yes,
        }])
        .vote(&voter, &yes);

    let invoke_no = MockAuthInvoke {
        contract: &contract_id,
        fn_name: "vote",
        args: (voter.clone(), no.clone()).into_val(&env),
        sub_invokes: &[],
    };
    client
        .mock_auths(&[MockAuth {
            address: &voter,
            invoke: &invoke_no,
        }])
        .vote(&voter, &no);
}

#[test]
#[should_panic(expected = "Invalid choice selection")]
fn test_invalid_choice_panics() {
    let env = Env::default();
    let contract_id = env.register(LivePollContract, ());
    let client = LivePollContractClient::new(&env, &contract_id);

    let voter = Address::generate(&env);
    let choice = symbol_short!("MAYBE");

    let invoke = MockAuthInvoke {
        contract: &contract_id,
        fn_name: "vote",
        args: (voter.clone(), choice.clone()).into_val(&env),
        sub_invokes: &[],
    };
    client
        .mock_auths(&[MockAuth {
            address: &voter,
            invoke: &invoke,
        }])
        .vote(&voter, &choice);
}
