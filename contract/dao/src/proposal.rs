use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, PublicKey};
use std::collections::HashMap;

use crate::{
    action::{
        ActionTransaction, TransactionInput,
    },
    vote_policy::{VoteConfigActive},
};

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Debug, PartialEq))]
#[serde(crate = "near_sdk::serde")]
/// User provided proposal type
pub struct ProposalInput {
    pub tags: Vec<String>,
    pub description: String,
    pub transaction: TransactionInput, // actions for this proposal must exist and must be in order, index in first vec is vote ident
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Debug, PartialEq))]
#[serde(crate = "near_sdk::serde")]
pub enum ProposalKindIdent {
    Pay,
    AddMember,
    RemoveMember,
    RegularPayment
}

impl ProposalKindIdent {
    pub fn get_ident_from(tx_input: &TransactionInput) -> Self {
        match tx_input {
            TransactionInput::Pay { .. } => ProposalKindIdent::Pay,
            TransactionInput::AddMember { .. } => ProposalKindIdent::AddMember,
            TransactionInput::RemoveMember { .. } => ProposalKindIdent::RemoveMember,
            TransactionInput::RegularPayment { .. } => ProposalKindIdent::RegularPayment,
            _ => unimplemented!(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Clone, Debug, PartialEq))]
#[serde(crate = "near_sdk::serde")]
pub struct Proposal {
    pub uuid: u32,
    pub proposed_by: AccountId,
    pub invoked_by_acc: AccountId,
    pub invoked_by_pk: PublicKey,
    pub description: String,
    pub tags: Vec<String>,
    pub status: ProposalStatus,
    pub votes: HashMap<AccountId, u8>,   // account id, vote id
    pub transactions: ActionTransaction, // id of transaction should match vote id above
    pub vote_config: VoteConfigActive,
}

impl Proposal {

    //TODO refactor
    pub fn update_status(&mut self, status: ProposalStatus){
        self.status = status;
    }
}

impl Proposal {
    pub fn new(
        proposer: AccountId,
        input: ProposalInput,
        tx: ActionTransaction,
        vote_policy: VoteConfigActive,
        uuid: u32,
        invoker_acc: AccountId,
        invoker_pk: PublicKey,
    ) -> Self {
        Proposal {
            uuid: uuid,
            proposed_by: proposer,
            invoked_by_acc: invoker_acc,
            invoked_by_pk: invoker_pk,
            description: input.description,
            tags: input.tags,
            status: ProposalStatus::InProgress,
            votes: HashMap::new(),
            transactions: tx,
            vote_config: vote_policy,
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Clone)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Debug))]
#[serde(crate = "near_sdk::serde")]
pub enum ProposalStatus {
    InProgress,
    Invalid, // Not enough voters/tokens when time expired or could not apply tx
    Spam,
    Rejected,
    Accepted, // Accepted and winning transaction executed
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Clone, Debug))]
#[serde(crate = "near_sdk::serde")]
pub enum VoteResult {
    Ok,
    AlreadyVoted,
    InvalidVote,
    VoteEnded,
}