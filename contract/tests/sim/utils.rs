use dao::core::{DEPOSIT_VOTE, GAS_VOTE};
use dao::{config::ConfigInput, proposal::ProposalKindIdent, release::ReleaseModelInput, vote_policy::VoteConfigInput};

/// Utils / Helper module for easier simulation testing
use near_contract_standards::fungible_token::metadata::{FungibleTokenMetadata, FT_METADATA_SPEC};
use near_sdk::json_types::{ValidAccountId};
use near_sdk::serde_json::json;
use near_sdk_sim::{
    init_simulator,
    runtime::GenesisConfig,
    to_yocto, ExecutionResult, UserAccount,
};
use std::convert::TryFrom;

near_sdk_sim::lazy_static_include::lazy_static_include_bytes! {
    DAO_FACTORY_WASM_BYTES => "res/dao_factory.wasm",
    DAO_WASM_BYTES => "res/dao.wasm",
}

pub const FT_TOTAL_SUPPLY: u32 = 1_000_000_000;
pub const FT_INIT_DISTRIBUTION: u32 = 200_000_000;

pub const RELEASE_TIME: u64 = 63_072_000_000_000_000; //in nanoseconds
pub const DURATION_ONE_WEEK: u64 = 7_000_000; //604_800_000_000_000; changed to shorter because cant alter timestamp in simulator
pub const VOTE_ONLY_ONCE: bool = true;
pub const VOTE_SPAM_THRESHOLD: u8 = 80;
pub const PARENT_SHARE: u8 = 10;
pub const INSIDERS_SHARE: u8 = 25;
pub const FOUNDATION_SHARE: u8 = 15;
pub const COMMUNITY_SHARE: u8 = 10;

pub const DAO_FACTORY: &str = "dao_factory";
pub const DAO_FACTORY_ACC: &str = "dao_factory";
pub const DAO: &str = "dao";
pub const DAO_ACC: &str = "dao.dao_factory";
pub const DAO_DESC: &str = "dao contract desc";

pub const ALICE: &str = "alice";
pub const BOB: &str = "bob";
pub const DANNY: &str = "danny";
pub const LUKE: &str = "luke";
pub const MARIO: &str = "mario";
pub const EVA: &str = "eva";

pub const FOUNDER_1: &str = "founder_1";
pub const FOUNDER_2: &str = "founder_2";
pub const FOUNDER_3: &str = "founder_3";
pub const FOUNDER_4: &str = "founder_4";
pub const FOUNDER_5: &str = "founder_5";

//Set custom near config here
fn near_genesis_config() -> Option<GenesisConfig> {
    /*
    Some(
        GenesisConfig
        {
            genesis_time: u64,
            gas_price: Balance,
            gas_limit: Gas,
            genesis_height: u64,
            epoch_length: u64,
            block_prod_time: Duration,
            runtime_config: RuntimeConfig,
            state_records: Vec<StateRecord>,
            validators: Vec<AccountInfo>
        }
    )
    */

    None
}

/// Inits Near blockchain env
pub fn init_env() -> UserAccount {
    init_simulator(near_genesis_config())
}

pub fn get_default_founders() -> Vec<ValidAccountId> {
    vec![
        ValidAccountId::try_from(FOUNDER_1).unwrap(),
        ValidAccountId::try_from(FOUNDER_2).unwrap(),
        ValidAccountId::try_from(FOUNDER_3).unwrap(),
    ]
}

pub fn get_founders_5() -> Vec<ValidAccountId> {
    vec![
        ValidAccountId::try_from(FOUNDER_1).unwrap(),
        ValidAccountId::try_from(FOUNDER_2).unwrap(),
        ValidAccountId::try_from(FOUNDER_3).unwrap(),
        ValidAccountId::try_from(FOUNDER_4).unwrap(),
        ValidAccountId::try_from(FOUNDER_5).unwrap(),
    ]
}

pub fn get_default_metadata() -> FungibleTokenMetadata {
    FungibleTokenMetadata {
        spec: FT_METADATA_SPEC.to_string(),
        name: "Example NEAR fungible token".to_string(),
        symbol: "EXAMPLE".to_string(),
        icon: Some("some_icon".to_string()),
        reference: None,
        reference_hash: None,
        decimals: 8,
    }
}

pub fn get_default_config() -> ConfigInput {
    ConfigInput {
        insiders_share: Some(INSIDERS_SHARE),
        foundation_share: Some(FOUNDATION_SHARE),
        community_share: Some(COMMUNITY_SHARE),
        description: Some(DAO_DESC.to_string()),
        vote_spam_threshold: Some(VOTE_SPAM_THRESHOLD),
    }
}

pub fn get_default_vote_policy_config() -> Vec<VoteConfigInput> {
    let mut configs = Vec::new();

    configs.push(VoteConfigInput {
        proposal_kind: ProposalKindIdent::AddMember,
        duration: 15_000_000_000,
        waiting_open_duration: 50_000_000_000,
        quorum: 20,
        approve_threshold: 51,
        vote_only_once: VOTE_ONLY_ONCE,
    });

    configs.push(VoteConfigInput {
        proposal_kind: ProposalKindIdent::RemoveMember,
        duration: 15_000_000_000,
        waiting_open_duration: 50_000_000_000,
        quorum: 15,
        approve_threshold: 51,
        vote_only_once: VOTE_ONLY_ONCE,
    });

    configs.push(VoteConfigInput {
        proposal_kind: ProposalKindIdent::Pay,
        duration: 10_000_000_000,
        waiting_open_duration: 50_000_000_000,
        quorum: 20,
        approve_threshold: 51,
        vote_only_once: VOTE_ONLY_ONCE,
    });

    configs.push(VoteConfigInput {
        proposal_kind: ProposalKindIdent::RegularPayment,
        duration: 10_000_000_000,
        waiting_open_duration: 50_000_000_000,
        quorum: 20,
        approve_threshold: 51,
        vote_only_once: VOTE_ONLY_ONCE,
    });

    configs
}

pub fn get_default_release_config() -> ReleaseModelInput {
    ReleaseModelInput::Voting
}
/// Initializes Factory Acc and its contract. Then inits dao account, with its contract via its factory function.
/// It is the main base function that all other sim tests are built upon.
/// Test case is in basic_tests.rs - "init_contracts_and_check_state".
/// This version is slightly modified because near test toolset does not allow to create UserAccount struct from already initialized account via another contract (as seen in the test case)
pub fn init_factory_with_dao(
    root: &mut UserAccount,
    factory_acc_name: &str,
    dao_acc_name: &str,
    factory_deposit: &str,
    dao_deposit: &str,
    dao_name: &str,
    total_supply: u32,
    init_distribution: u32,
    metadata: FungibleTokenMetadata,
    config: ConfigInput,
    release_config: ReleaseModelInput,
    vote_policy_configs: Vec<VoteConfigInput>,
    founders: Vec<ValidAccountId>,
) -> (UserAccount, UserAccount) {
    assert!(
        to_yocto(factory_deposit) >= to_yocto("100"),
        "Factory deposit must be >= 100 NEAR"
    );
    assert!(
        to_yocto(dao_deposit) >= to_yocto("10"),
        "Dao deposit must be >= 10 NEAR"
    );

    let factory = root.deploy(
        &DAO_FACTORY_WASM_BYTES,
        factory_acc_name.to_string(),
        to_yocto(factory_deposit),
    );

    factory.call(factory.account_id(), "new", &[], from_tgas(1), 0);

    //bellow it differs from the test case
    let dao = factory.deploy_and_init(
        &DAO_WASM_BYTES,
        dao_acc_name.to_string(),
        "new",
        &json!({
            "name": dao_name,
            "total_supply": total_supply,
            "init_distribution": init_distribution,
            "ft_metadata": metadata,
            "config": config,
            "release_config": release_config,
            "vote_policy_configs": vote_policy_configs,
            "founders": founders,
        })
        .to_string()
        .into_bytes(),
        to_yocto(dao_deposit),
        from_tgas(100),
    );

    // some checks that both contracts were inited
    assert!(factory.account().unwrap().amount < to_yocto(factory_deposit));
    assert!(dao.account().unwrap().amount > to_yocto(dao_deposit));

    (factory, dao)
}

/// Registers user in dao via standart "storage_deposit" method
pub fn register_user(user: &UserAccount, dao: &UserAccount) -> ExecutionResult {
    let view_result = user.view(dao.account_id(), "storage_balance_bounds", &[]);
    let minimal_register_bound = view_result.unwrap_json_value().get("min").unwrap().clone();

    let call_register = user.call(
        dao.account_id(),
        "storage_deposit",
        &json!({}).to_string().into_bytes(),
        from_tgas(10),
        u128::from_str_radix(minimal_register_bound.as_str().unwrap(), 10).unwrap(),
    );

    call_register.assert_success();
    call_register
}

pub fn vote_as_user(
    user: &UserAccount,
    dao: &UserAccount,
    proposal_id: u32,
    vote_kind: u8,
) -> ExecutionResult {
    let call_vote = user.call(
        dao.account_id(),
        "vote",
        &json!({
            "proposal_id": proposal_id,
            "vote_kind": vote_kind,
            "account_id": user.account_id
        })
        .to_string()
        .into_bytes(),
        GAS_VOTE,
        DEPOSIT_VOTE,
    );

    pp("User votes", &call_vote);
    call_vote.assert_success();
    call_vote
}

/// Converts TGas units to gas
pub fn from_tgas(amount: u64) -> u64 {
    amount * u64::pow(10, 12)
}

/// Pretty prints execution (call) result values
pub fn pp(name: &str, exec_result: &ExecutionResult) {
    println!(
        "\n-----{} result: -----\nstatus: {:#?}\ngas_burnt: {}\ntokens_burnt: {} Ⓝ\n--------------------------------\n",
        //call_new.profile_data(), dont use, its bugged !
        name.to_string(),
        exec_result.outcome().status,
        (exec_result.outcome().gas_burnt) as f64,
        (exec_result.outcome().tokens_burnt) as f64 / 1e24
    );
}
