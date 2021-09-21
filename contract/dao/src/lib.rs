use near_sdk::{CryptoHash, env::sha256};

pub mod core;
pub mod view;

pub mod action;
pub mod config;
pub mod proposal;
pub mod release;
pub mod vote_policy;

mod unit_tests;

pub type UUID = CryptoHash;

pub fn generate_uuid(input: &[u8]) -> UUID {
    let mut tmp = [0u8;32];
    tmp.copy_from_slice(&sha256(input));
    tmp
}
