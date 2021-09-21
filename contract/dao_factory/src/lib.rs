use std::convert::TryFrom;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base58PublicKey, Base64VecU8, ValidAccountId, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    assert_self, env, ext_contract, log, near_bindgen, serde_json::json, AccountId,
    BorshStorageKey, PanicOnDefault, Promise,
};
use near_sdk::{PromiseOrValue, PromiseResult};

use near_contract_standards::fungible_token::metadata::{
    FungibleTokenMetadata, FungibleTokenMetadataProvider, FT_METADATA_SPEC,
};

near_sdk::setup_alloc!();

///include binary code of dao contract
const CODE: &[u8] = include_bytes!("../../res/dao.wasm");

/// Gas spent on the call & account creation.
const CREATE_CALL_GAS: u64 = 75_000_000_000_000;

/// Gas allocated on the callback.
const ON_CREATE_CALL_GAS: u64 = 10_000_000_000_000;

#[ext_contract(ext_self)]
pub trait ExtSelf {
    fn on_create(
        &mut self,
        account_id: AccountId,
        attached_deposit: U128,
        predecessor_account_id: AccountId,
        dao_info: DaoInfo,
    ) -> bool;

    fn on_delete(&mut self, account: String) -> bool;
}

#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKeys {
    Daos,
}
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct NearDaoFactory {
    pub daos: UnorderedMap<AccountId, DaoInfo>,
    pub key: Base58PublicKey, //TODO vec<u8>
}

#[near_bindgen]
impl NearDaoFactory {
    
    #[init]
    pub fn new() -> Self {
        Self {
            daos: UnorderedMap::new(StorageKeys::Daos),
            key: Base58PublicKey::try_from(env::signer_account_pk()).unwrap(), 
        }
    }

    #[private]
    #[init(ignore_state)]
    pub fn migrate() -> Self {
        env::state_read().expect("Failed to migrate")
    }

    pub fn get_dao_list(&self) -> Vec<(AccountId, DaoInfo)> {
        self.daos.to_vec()
    }

    pub fn get_dao_info(&self, account: &AccountId) -> Option<DaoInfo> {
        self.daos.get(account)
    }

    #[payable]
    pub fn create(
        &mut self,
        acc_name: AccountId,
        public_key: Option<Base58PublicKey>, //TODO refactor
        dao_info: DaoInfo,
        args: Base64VecU8,
    ) -> Promise {
        let account_id = format!("{}.{}", acc_name, env::current_account_id());
        log!("Creating account: {}", account_id);

        assert!(
            self.get_dao_info(&account_id).is_none(),
            "{}",
            "Dao already exists"
        );

        let promise = Promise::new(account_id.clone())
            .create_account()
            .deploy_contract(CODE.to_vec())
            .transfer(env::attached_deposit())
            .add_full_access_key(self.key.clone().into());

        log!(
            "Dao factory - Prepaid gas: {}",
            env::prepaid_gas().to_string(),
        );

        promise
            .function_call(
                b"new".to_vec(),
                args.into(),
                0,
                env::prepaid_gas() - CREATE_CALL_GAS - ON_CREATE_CALL_GAS,
            )
            .then(ext_self::on_create(
                acc_name,
                U128(env::attached_deposit()),
                env::predecessor_account_id(),
                dao_info,
                &env::current_account_id(),
                0,
                ON_CREATE_CALL_GAS,
            ))
    }

    pub fn on_create(
        &mut self,
        account_id: AccountId,
        attached_deposit: U128,
        predecessor_account_id: AccountId,
        dao_info: DaoInfo,
    ) -> bool {
        if near_sdk::is_promise_success() {
            self.daos.insert(&account_id, &dao_info);
            true
        } else {
            Promise::new(predecessor_account_id).transfer(attached_deposit.0);
            false
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Debug, PartialEq, Clone))]
#[serde(crate = "near_sdk::serde")]
pub struct DaoInfo {
    pub name: String,
    pub description: String,
    pub ft_name: String,
    pub ft_amount: u32,
    pub tags: Vec<String>,
}

#[cfg(test)]
mod tests {
    //TODO
}
