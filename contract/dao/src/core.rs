use std::convert::TryFrom;
use std::hint::unreachable_unchecked;
use std::ops::Add;
use std::u128;

use near_contract_standards::fungible_token::metadata::FungibleTokenMetadata;
use near_contract_standards::fungible_token::FungibleToken;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{ValidAccountId, U128};
use near_sdk::serde::{Serialize};
use near_sdk::{
    env, log, near_bindgen, AccountId, Balance, BorshStorageKey, PanicOnDefault, Promise,
    PromiseOrValue,
};

use near_contract_standards::storage_management::{
    StorageBalance, StorageBalanceBounds, StorageManagement,
};

use near_contract_standards::fungible_token::core::FungibleTokenCore;
use near_contract_standards::fungible_token::resolver::FungibleTokenResolver;

use crate::action::*;
use crate::config::*;
use crate::proposal::*;
use crate::release::{ReleaseModel, ReleaseModelInput};
use crate::vote_policy::{VoteConfig, VoteConfigInput};

use crate::vote_policy::VoteConfigActive;

near_sdk::setup_alloc!();

pub const GAS_ADD_PROPOSAL: u64 = 100_000_000_000_000; //gas units
pub const GAS_FINISH_PROPOSAL: u64 = 100_000_000_000_000;
pub const GAS_VOTE: u64 = 10_000_000_000_000;
pub const DEPOSIT_ADD_PROPOSAL: u128 = 1_000_000_000_000_000_000_000_000; // 1 N
pub const DEPOSIT_VOTE: u128 = 1_000_000_000_000_000_000_000_000; // 1 N

pub const INDEX_RELEASED_INSIDERS: u8 = 0;
pub const INDEX_RELEASED_COMMUNITY: u8 = 1;
pub const INDEX_RELEASED_FOUNDATION: u8 = 2;
pub const INDEX_RELEASED_PARENT: u8 = 3;
pub const INDEX_RELEASED_OWNER: u8 = 4;

pub const METADATA_MAX_DECIMALS: u8 = 28;

pub const MAX_FT_TOTAL_SUPPLY: u32 = 1_000_000_000;

pub const PROPOSAL_KIND_COUNT: u8 = 4;

#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKeys {
    FT,
    FTMetadata,
    Proposals,
    ProposalConfig,
    Insiders,
    Foundation,
    Community,
    ReleaseConfig,
    RegularPayment,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct NearDaoContract {
    pub founded: u64,
    pub owner: AccountId,
    pub name: String,
    pub config: Config,
    pub insiders: UnorderedSet<AccountId>,
    pub foundation: UnorderedSet<AccountId>,
    pub community: UnorderedSet<AccountId>,
    pub registered_accounts_count: u32,
    pub ft_metadata: LazyOption<FungibleTokenMetadata>,
    pub ft: FungibleToken,
    pub total_supply: u32,
    pub init_distribution: u32,
    pub free_ft: u128,
    pub already_released_ft: u128,
    pub decimal_const: u128,
    pub proposals: UnorderedMap<u32, Proposal>,
    pub proposal_count: u32,
    pub release_db: [u32; 5],
    pub vote_policy_config: LookupMap<ProposalKindIdent, VoteConfig>,
    pub release_config: LazyOption<ReleaseModel>,
    pub regular_payments: UnorderedSet<RegularPayment>,
}

#[near_bindgen]
impl NearDaoContract {
    #[init]
    pub fn new(
        name: String,
        total_supply: u32,
        init_distribution: u32,
        ft_metadata: FungibleTokenMetadata,
        config: ConfigInput,
        release_config: ReleaseModelInput,
        vote_policy_configs: Vec<VoteConfigInput>,
        founders: Vec<AccountId>,
    ) -> Self {
        assert!(total_supply <= MAX_FT_TOTAL_SUPPLY);
        assert!(ft_metadata.decimals <= METADATA_MAX_DECIMALS);
        assert!(
            founders.len() > 0,
            "{}",
            "At least one founder must be provided" // INSIDERS MUST BE UNIQUE, this invarint must be uphold by application
        );
        assert_eq!(vote_policy_configs.len(), PROPOSAL_KIND_COUNT as usize); //TODO check
        ft_metadata.assert_valid();
        assert_valid_init_config(&config);
        assert!(
            total_supply >= init_distribution,
            "{}",
            "Init distribution cannot be larger than total supply"
        );

        let amount_per_founder: u32 = (init_distribution as u64
            * config.insiders_share.unwrap_or_default() as u64
            / 100
            / founders.len() as u64) as u32;

        let decimal_const = 10u128.pow(ft_metadata.decimals as u32);

        let mut contract = NearDaoContract {
            founded: env::block_timestamp(),
            owner: env::predecessor_account_id(),
            name: name,
            config: Config::from(config),
            insiders: UnorderedSet::new(StorageKeys::Insiders),
            foundation: UnorderedSet::new(StorageKeys::Foundation),
            community: UnorderedSet::new(StorageKeys::Community),
            registered_accounts_count: founders.len() as u32,
            ft_metadata: LazyOption::new(StorageKeys::FTMetadata, Some(&ft_metadata)),
            ft: FungibleToken::new(StorageKeys::FT),
            total_supply: total_supply,
            init_distribution: init_distribution,
            free_ft: init_distribution as u128 * decimal_const
                - amount_per_founder as u128 * founders.len() as u128 * decimal_const,
            already_released_ft: init_distribution as u128 * decimal_const,
            decimal_const: decimal_const,
            proposals: UnorderedMap::new(StorageKeys::Proposals),
            proposal_count: 0,
            release_db: [amount_per_founder * founders.len() as u32, 0, 0, 0, 0],
            vote_policy_config: LookupMap::new(StorageKeys::ProposalConfig),
            release_config: LazyOption::new(StorageKeys::ReleaseConfig, None),
            regular_payments: UnorderedSet::new(StorageKeys::RegularPayment),
        };

        contract.setup_voting_policy(vote_policy_configs);
        contract.setup_release_model(release_config, init_distribution);

        //register contract account and transfer all total supply of GT to it
        contract
            .ft
            .internal_register_account(&env::current_account_id());
        contract.ft.internal_deposit(
            &env::current_account_id(),
            contract.total_supply as u128 * contract.decimal_const,
        );

        // register insiders and distribute them their amount of the tokens
        for insider in founders.iter() {
            contract.ft.internal_register_account(&insider);

            contract.ft.internal_transfer(
                &env::current_account_id(),
                &insider,
                amount_per_founder as u128 * contract.decimal_const,
                None,
            );
            contract.insiders.insert(insider);
        }

        contract
    }

    #[payable]
    pub fn add_proposal(&mut self, proposal_input: ProposalInput) -> u32 {
        assert!(env::attached_deposit() >= DEPOSIT_ADD_PROPOSAL);
        assert!(env::prepaid_gas() >= GAS_ADD_PROPOSAL);
        if !self
            .ft
            .accounts
            .contains_key(&env::predecessor_account_id())
        {
            self.storage_deposit(
                Some(ValidAccountId::try_from(env::predecessor_account_id()).unwrap()),
                None,
            );
        }

        let vote_policy = self
            .vote_policy_config
            .get(&ProposalKindIdent::get_ident_from(
                &proposal_input.transaction,
            ))
            .expect("Invalid proposal input");

        let tx = self
            .create_tx(
                proposal_input.transaction.clone(),
                env::current_account_id(),
                env::block_timestamp(),
            )
            .unwrap();

        self.proposal_count += 1;

        let proposal = Proposal::new(
            env::current_account_id(),
            proposal_input,
            tx,
            VoteConfigActive {
                duration_to: vote_policy.duration.add(env::block_timestamp()),
                quorum: vote_policy.quorum,
                vote_only_once: vote_policy.vote_only_once,
                waiting_open_duration: vote_policy.waiting_open_duration,
                approve_threshold: vote_policy.approve_threshold,
            },
            self.proposal_count,
            env::signer_account_id(),
            env::signer_account_pk(),
        );

        self.proposals.insert(&proposal.uuid, &proposal);
        proposal.uuid
    }

    #[payable]
    /// vote_kind values: 0 = spam, 1 = yes, 2 = no
    pub fn vote(&mut self, proposal_id: u32, vote_kind: u8) -> VoteResult {
        assert!(env::attached_deposit() >= DEPOSIT_VOTE);
        assert!(env::prepaid_gas() >= GAS_VOTE);
        if !self
            .ft
            .accounts
            .contains_key(&env::predecessor_account_id())
        {
            self.storage_deposit(
                Some(ValidAccountId::try_from(env::predecessor_account_id()).unwrap()),
                None,
            );
        }
        assert!(env::predecessor_account_id() != self.owner);

        let mut proposal = self.proposals.get(&proposal_id).expect("Unknown proposal");

        if proposal.status != ProposalStatus::InProgress
            || proposal.vote_config.duration_to <= env::block_timestamp()
        {
            return VoteResult::VoteEnded;
        }

        if vote_kind > 2 {
            return VoteResult::InvalidVote;
        }

        if proposal.vote_config.vote_only_once
            && proposal.votes.contains_key(&env::predecessor_account_id())
        {
            return VoteResult::AlreadyVoted;
        }

        proposal
            .votes
            .insert(env::predecessor_account_id(), vote_kind);

        self.proposals.insert(&proposal_id, &proposal);
        VoteResult::Ok
    }

    pub fn finish_proposal(&mut self, proposal_id: u32) -> ProposalStatus {
        assert!(env::prepaid_gas() >= GAS_FINISH_PROPOSAL);
        let mut proposal = self.proposals.get(&proposal_id).expect("Unknown proposal");

        match proposal.status {
            ProposalStatus::InProgress => {
                if env::block_timestamp() < proposal.vote_config.duration_to {
                    ProposalStatus::InProgress
                } else {
                    // count votes
                    let mut votes = vec![0 as u128; 3];
                    for (voter, vote_value) in proposal.votes.iter() {
                        votes[*vote_value as usize] += self.ft.accounts.get(voter).unwrap();
                    }

                    let total_voted_amount: u128 = votes.iter().sum();
                    log!("votes: {:?}", votes);
                    log!("total_voted_amount: {:?}", total_voted_amount);
                    log!(
                        "quorum check: {}",
                        (((total_voted_amount / self.decimal_const) as f64
                            / ((self.already_released_ft - self.free_ft) / self.decimal_const)
                                as f64
                            * 100.0)
                            .round() as u8)
                    );

                    // check spam
                    if ((votes[0] / self.decimal_const) as f64
                        / (total_voted_amount / self.decimal_const) as f64
                        * 100.0)
                        .round() as u8
                        >= self.config.vote_spam_threshold
                    {
                        proposal.update_status(ProposalStatus::Spam);
                        self.proposals.insert(&proposal.uuid.clone(), &proposal);

                        ProposalStatus::Spam
                    } else if (((total_voted_amount / self.decimal_const) as f64
                        / ((self.already_released_ft - self.free_ft) / self.decimal_const) as f64
                        * 100.0)
                        .round() as u8)
                        < proposal.vote_config.quorum
                    {
                        // not enough quorum
                        proposal.update_status(ProposalStatus::Invalid);
                        self.proposals.insert(&proposal.uuid.clone(), &proposal);
                        ProposalStatus::Invalid
                    } else if (((votes[1] / self.decimal_const) as f64
                        / (total_voted_amount / self.decimal_const) as f64
                        * 100.0)
                        .round() as u8)
                        < proposal.vote_config.approve_threshold
                    {
                        // not enough voters to accept
                        proposal.update_status(ProposalStatus::Rejected);
                        self.proposals.insert(&proposal.uuid.clone(), &proposal);
                        ProposalStatus::Rejected
                    } else {
                        // proposal is accepted, try to execute transaction
                        if let Err(errors) = self.execute_tx(
                            &proposal.transactions,
                            env::attached_deposit(),
                            env::account_balance(),
                            env::block_timestamp(),
                        ) {
                            ProposalStatus::Invalid
                        } else {
                            proposal.update_status(ProposalStatus::Accepted);
                            self.proposals.insert(&proposal.uuid.clone(), &proposal);
                            ProposalStatus::Accepted
                        }
                    }
                }
            }
            _ => proposal.status,
        }
    }

    /// For dev/testing purposes only
    #[private]
    pub fn delete_self(self) -> Promise {
        Promise::new(env::current_account_id()).delete_account(self.owner)
    }
}

pub fn assert_valid_init_config(config: &ConfigInput) {
    assert!(
        config.insiders_share.unwrap()
            + config.community_share.unwrap_or_default()
            + config.foundation_share.unwrap_or_default()
            <= 100
    );
    assert!(config.vote_spam_threshold.unwrap_or_default() <= 100);
    assert!(config.description.as_ref().unwrap().len() > 0);
}

impl NearDaoContract {
    pub fn setup_voting_policy(&mut self, configs: Vec<VoteConfigInput>) {
        for p in configs.into_iter() {
            assert!(
                self.vote_policy_config
                    .insert(&p.proposal_kind.clone(), &VoteConfig::try_from(p).unwrap())
                    .is_none(),
                "{}",
                "Duplicate voting policy"
            );
        }
    }
    pub fn setup_release_model(
        &mut self,
        release_config: ReleaseModelInput,
        already_released_ft: u32,
    ) {
        let model = match release_config {
            ReleaseModelInput::Voting => ReleaseModel::Voting,
            _ => unimplemented!(),
        };

        self.release_config.set(&model);
    }

    fn on_account_closed(&self, account_id: AccountId, balance: Balance) {
        log!("Closed @{} with {}", account_id, balance);
    }

    fn on_tokens_burned(&self, account_id: AccountId, amount: Balance) {
        log!("Account @{} burned {}", account_id, amount);
    }

    /// Validates all actions and tries to execute transaction
    pub fn execute_tx(
        &mut self,
        tx: &ActionTransaction,
        attached_deposit: u128,
        current_balance: u128,
        current_block_timestamp: u64,
    ) -> Result<(), Vec<ActionExecutionError>> {
        let mut errors: Vec<ActionExecutionError> = Vec::new();

        // Checks if all actions might be successfully executed
        self.validate_tx_before_execution(
            tx,
            current_balance,
            attached_deposit,
            current_block_timestamp,
            &mut errors,
        );

        if !errors.is_empty() {
            return Err(errors);
        }

        // All actions should be executed now without any error
        for action in tx.actions.iter() {
            self.execute_action(action);
        }

        Ok(())
    }

    pub fn validate_tx_before_execution(
        &self,
        tx: &ActionTransaction,
        current_balance: u128,
        attached_deposit: u128,
        current_block_timestamp: u64,
        errors: &mut Vec<ActionExecutionError>,
    ) {
        for action in tx.actions.iter() {
            match action {
                Action::SendNear {
                    account_id,
                    amount_near,
                } => {
                    if current_balance < *amount_near {
                        errors.push(ActionExecutionError::MissingNearTokens);
                    }
                }
                Action::AddMember { account_id, group } => {}
                Action::RemoveMember { account_id, group } => {}
                Action::RegularPayment {
                    account_id,
                    amount_near,
                    since,
                    until,
                    period,
                } => {
                    if *since <= current_block_timestamp || *until <= current_block_timestamp {
                        errors.push(ActionExecutionError::InvalidTimeInputs);
                    }
                }
                _ => unimplemented!(),
            }
        }
    }

    pub fn execute_action(&mut self, action: &Action) {
        match action {
            Action::SendNear {
                account_id,
                amount_near,
            } => {
                Promise::new(account_id.into()).transfer(*amount_near);
            }
            Action::AddMember { account_id, group } => {
                let is_user_registered = self.ft.accounts.contains_key(account_id);
                if !is_user_registered {
                    self.ft.internal_register_account(account_id);
                    self.registered_accounts_count += 1;
                }

                match group {
                    TokenGroup::Insiders => {
                        self.insiders.insert(account_id);
                    }
                    TokenGroup::Foundation => {
                        self.foundation.insert(account_id);
                    }
                    TokenGroup::Community => {
                        self.community.insert(account_id);
                    }
                    TokenGroup::Public => (),
                }
            }
            Action::RemoveMember { account_id, group } => match group {
                TokenGroup::Insiders => {
                    self.insiders.remove(account_id);
                }
                TokenGroup::Foundation => {
                    self.foundation.remove(account_id);
                }
                TokenGroup::Community => {
                    self.community.remove(account_id);
                }
                TokenGroup::Public => unsafe { unreachable_unchecked() },
            },
            Action::RegularPayment {
                account_id,
                amount_near,
                since,
                until,
                period,
            } => {
                self.regular_payments.insert(&RegularPayment {
                    account_id: account_id.to_owned(),
                    amount_near: *amount_near,
                    next: *since,
                    end: *until,
                    period: period.to_nanos(),
                });
            }
            _ => unimplemented!(),
        }
    }

    pub fn create_tx(
        &self,
        tx_input: TransactionInput,
        caller: AccountId,
        current_block_timestamp: u64,
    ) -> Result<ActionTransaction, Vec<&'static str>> {
        let mut actions = Vec::with_capacity(2);
        let mut errors = Vec::with_capacity(2);

        match tx_input {
            TransactionInput::Pay {
                account_id,
                amount_near,
            } => {
                actions.push(Action::SendNear {
                    account_id,
                    amount_near: amount_near.0,
                });
            }
            TransactionInput::AddMember { account_id, group } => {
                match group {
                    TokenGroup::Insiders => {
                        if self.insiders.contains(&account_id) {
                            errors.push("User is already in group");
                        }
                    }
                    TokenGroup::Foundation => {
                        if self.config.foundation_share.is_none() {
                            errors.push("Group is not permitted");
                        } else if self.foundation.contains(&account_id) {
                            errors.push("User is already in group");
                        }
                    }
                    TokenGroup::Community => {
                        if self.config.community_share.is_none() {
                            errors.push("Group is not permitted");
                        } else if self.community.contains(&account_id) {
                            errors.push("User is already in group");
                        }
                    }
                    TokenGroup::Public => {
                        if self.ft.accounts.contains_key(&account_id) {
                            errors.push("User is already in group");
                        }
                    }
                }

                if errors.is_empty() {
                    actions.push(Action::AddMember {
                        account_id,
                        group: group,
                    });
                }
            }
            TransactionInput::RemoveMember { account_id, group } => {
                match group {
                    TokenGroup::Insiders => {
                        if !self.insiders.contains(&account_id) {
                            errors.push("User is not in group");
                        }
                    }
                    TokenGroup::Foundation => {
                        if self.config.foundation_share.is_none() {
                            errors.push("Group is not permitted");
                        } else if !self.foundation.contains(&account_id) {
                            errors.push("User is not in group");
                        }
                    }
                    TokenGroup::Community => {
                        if self.config.community_share.is_none() {
                            errors.push("Group is not permitted");
                        } else if !self.community.contains(&account_id) {
                            errors.push("User is not in group");
                        }
                    }
                    TokenGroup::Public => {
                        errors.push("Remove from public group is forbidden");
                    }
                }

                if errors.is_empty() {
                    actions.push(Action::RemoveMember {
                        account_id,
                        group: group,
                    });
                }
            }
            TransactionInput::RegularPayment {
                account_id,
                amount_near,
                since,
                until,
                period,
            } => {
                if until <= since
                    || until <= current_block_timestamp
                    || since <= current_block_timestamp
                {
                    errors.push("Invalid time range")
                } else {
                    actions.push(Action::RegularPayment {
                        account_id,
                        amount_near: amount_near.into(),
                        since,
                        until,
                        period,
                    });
                }
            }

            _ => unimplemented!(),
        }

        if errors.is_empty() {
            return Ok(ActionTransaction { actions });
        } else {
            return Err(errors);
        }
    }
}

#[near_bindgen]
impl FungibleTokenCore for NearDaoContract {
    #[payable]
    fn ft_transfer(&mut self, receiver_id: ValidAccountId, amount: U128, memo: Option<String>) {
        if env::predecessor_account_id() == env::current_account_id() {
            self.free_ft -= amount.0;
        }
        self.ft.ft_transfer(receiver_id, amount, memo)
    }

    #[payable]
    fn ft_transfer_call(
        &mut self,
        receiver_id: ValidAccountId,
        amount: U128,
        memo: Option<String>,
        msg: String,
    ) -> PromiseOrValue<U128> {
        self.ft.ft_transfer_call(receiver_id, amount, memo, msg)
    }

    fn ft_total_supply(&self) -> U128 {
        self.ft.ft_total_supply()
    }

    fn ft_balance_of(&self, account_id: ValidAccountId) -> U128 {
        self.ft.ft_balance_of(account_id)
    }
}

#[near_bindgen]
impl FungibleTokenResolver for NearDaoContract {
    fn ft_resolve_transfer(
        &mut self,
        sender_id: ValidAccountId,
        receiver_id: ValidAccountId,
        amount: U128,
    ) -> U128 {
        let sender_id: AccountId = sender_id.into();
        let (used_amount, burned_amount) =
            self.ft
                .internal_ft_resolve_transfer(&sender_id, receiver_id, amount);
        if burned_amount > 0 {
            self.on_tokens_burned(sender_id, burned_amount);
        }
        used_amount.into()
    }
}

#[near_bindgen]
impl StorageManagement for NearDaoContract {
    #[payable]
    fn storage_deposit(
        &mut self,
        account_id: Option<ValidAccountId>,
        registration_only: Option<bool>,
    ) -> StorageBalance {
        self.registered_accounts_count += 1;
        self.ft.storage_deposit(account_id, registration_only)
    }

    #[payable]
    fn storage_withdraw(&mut self, amount: Option<U128>) -> StorageBalance {
        self.ft.storage_withdraw(amount)
    }

    #[payable]
    fn storage_unregister(&mut self, force: Option<bool>) -> bool {
        #[allow(unused_variables)]
        if let Some((account_id, balance)) = self.ft.internal_storage_unregister(force) {
            self.on_account_closed(account_id, balance);
            self.registered_accounts_count -= 1;
            true
        } else {
            false
        }
    }

    fn storage_balance_bounds(&self) -> StorageBalanceBounds {
        self.ft.storage_balance_bounds()
    }

    fn storage_balance_of(&self, account_id: ValidAccountId) -> Option<StorageBalance> {
        self.ft.storage_balance_of(account_id)
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Clone, Debug, PartialEq))]
#[serde(crate = "near_sdk::serde")]
pub struct RegularPayment {
    pub account_id: AccountId,
    pub amount_near: u128,
    pub next: u64,
    pub end: u64,
    pub period: u64,
}
