use ::core::panic;
use dao::core::GAS_FINISH_PROPOSAL;
use near_sdk::json_types::{Base58PublicKey, Base64VecU8, ValidAccountId};
use near_sdk::{serde_json::json};
use near_sdk::{serde_json};
use near_sdk_sim::to_yocto;
use near_sdk_sim::transaction::ExecutionStatus;

use dao_factory::*;

use crate::utils::*;

near_sdk_sim::lazy_static_include::lazy_static_include_bytes! {
    DAO_FACTORY_WASM_BYTES => "res/dao_factory.wasm",
    DAO_WASM_BYTES => "res/dao.wasm",
}

#[test]
/// Base test, must always pass !!!
fn init_contracts_and_check_state() {
    let root = init_env();

    let founders: Vec<ValidAccountId> = get_default_founders();
    let config = get_default_config();
    let vote_policy_configs = get_default_vote_policy_config();
    let release_config = get_default_release_config();
    let metadata = get_default_metadata();
    let some_user = root.create_user("petr".parse().unwrap(), to_yocto("200"));

    let factory = root.deploy(
        &DAO_FACTORY_WASM_BYTES,
        DAO_FACTORY.to_string(),
        to_yocto("100"),
    );

    assert_eq!(factory.account().unwrap().amount, to_yocto("100"));

    let call_new = factory.call(factory.account_id(), "new", &[], from_tgas(1), 0);

    call_new.assert_success();
    assert!(factory.account().unwrap().amount < to_yocto("100"));
    pp("Factory INIT", &call_new);
    println! {"factory storage usage: {}",factory.account().unwrap().storage_usage};

    let call_view_daos = some_user.view(factory.account_id(), "get_dao_list", &[]);

    assert!(call_view_daos.is_ok());
    assert_eq!(some_user.account().unwrap().amount, to_yocto("200"));

    let dao_info = DaoInfo {
        name: DAO.to_string(),
        description: DAO_DESC.to_string(),
        ft_name: "BRO".to_string(),
        ft_amount: FT_TOTAL_SUPPLY as u32,
        tags: vec!["test".to_string(),"dao".to_string()],
    };
    let args = Base64VecU8::from(
        json!({
            "name": DAO.to_string(),
            "total_supply": FT_TOTAL_SUPPLY,
            "init_distribution": FT_INIT_DISTRIBUTION,
            "ft_metadata": metadata,
            "config": config,
            "release_config": release_config,
            "vote_policy_configs": vote_policy_configs,
            "founders": founders,
        })
        .to_string()
        .into_bytes(),
    );

    let key: Option<Base58PublicKey> = None; 

    //suppose factory acc creates dao
    let call_create_dao = factory.call(
        factory.account_id(),
        "create",
        &json!({
            "acc_name": DAO,
            "public_key": key,
            "dao_info": dao_info,
            "args": args
        })
        .to_string()
        .into_bytes(),
        from_tgas(100),
        to_yocto("10"),
    );
    call_create_dao.assert_success();

    let dao_account = factory.borrow_runtime().view_account(DAO_ACC).unwrap();

    pp("Create DAO and init", &call_create_dao);
    println! {"dao storage usage: {}",dao_account.storage_usage};

    assert!(dao_account.amount > to_yocto("10")); //because of + 30% used_gas from contract init

    //check some dao properties
    let view_dao_members_count = root.view(DAO_ACC.to_string(), "registered_user_count", &[]);
    assert!(view_dao_members_count.is_ok());
    assert_eq!(
        view_dao_members_count.unwrap_json_value().as_u64().unwrap(),
        get_default_founders().len() as u64
    );

    //TODO add check for other stats

    let view_dao_info = root.view(DAO_FACTORY.to_string(), "get_dao_info", &json!({"account": DAO}).to_string().into_bytes());
    assert!(view_dao_info.is_ok());
    assert_eq!(
        view_dao_info.unwrap_json::<DaoInfo>(),
        dao_info
    );
}

#[test]
fn proposal_add_insider_accept() {
    let mut root = init_env();

    let founder_1 = root.create_user(FOUNDER_1.to_string(), to_yocto("200"));
    let founder_2 = root.create_user(FOUNDER_2.to_string(), to_yocto("200"));
    let founder_3 = root.create_user(FOUNDER_3.to_string(), to_yocto("200"));

    let (factory, dao) = init_factory_with_dao(
        &mut root,
        DAO_FACTORY_ACC,
        DAO,
        "100",
        "10",
        DAO,
        FT_TOTAL_SUPPLY,
        FT_INIT_DISTRIBUTION,
        get_default_metadata(),
        get_default_config(),
        get_default_release_config(),
        get_default_vote_policy_config(),
        get_default_founders(),
    );

    let alice = root.create_user(ALICE.to_string(), to_yocto("200"));
    let bob = root.create_user(BOB.to_string(), to_yocto("200"));
    let danny = root.create_user(DANNY.to_string(), to_yocto("200"));
    let luke = root.create_user(LUKE.to_string(), to_yocto("200"));
    let mario = root.create_user(MARIO.to_string(), to_yocto("200"));
    let eva = root.create_user(EVA.to_string(), to_yocto("200"));

    let view_registered_users_count = eva.view(dao.account_id(), "registered_user_count", &[]);
    assert_eq!(
        view_registered_users_count
            .unwrap_json_value()
            .as_u64()
            .unwrap(),
        3
    );

    //register users in dao
    register_user(&alice, &dao);
    register_user(&bob, &dao);
    register_user(&danny, &dao);
    register_user(&luke, &dao);
    register_user(&mario, &dao);
    register_user(&eva, &dao);

    //find out minimal registration deposit
    let view_registered_users_count = eva.view(dao.account_id(), "registered_user_count", &[]);
    assert_eq!(
        view_registered_users_count
            .unwrap_json_value()
            .as_u64()
            .unwrap(),
        9
    );

    let call_eva_ft_balance_before = root.view(
        dao.account_id(),
        "ft_balance_of",
        &json!({"account_id": eva.account_id()})
            .to_string()
            .into_bytes(),
    );

    assert!(call_eva_ft_balance_before.is_ok());
    assert_eq!(
        call_eva_ft_balance_before
            .unwrap_json_value()
            .as_str()
            .unwrap(),
        "0"
    );

    let t1 = root.borrow_runtime().current_block().block_timestamp;

    //someone creates proposal
    let call_add_proposal = eva.call(
        dao.account_id(),
        "add_proposal",
        &json!({
            "proposal_input" :
            {
                "description": "I want to be insider PLS",
                "transaction": { "AddMember": { "account_id": EVA.to_string(), "group": "Insiders"} },
                "tags": ["test","proposal"]
            },
            "account_id": EVA.to_string(),
        })
        .to_string()
        .into_bytes(),
        from_tgas(100),
        to_yocto("5"),
    );
    call_add_proposal.assert_success();

    pp("User adds general proposal", &call_add_proposal);

    let proposal_id: u32 = if let ExecutionStatus::SuccessValue(v) = call_add_proposal.status() {
        serde_json::from_slice(&v).unwrap()
    } else {
        panic!("Execution status is not success");
    };

    dbg!(proposal_id);

    // all 3 founders vote
    vote_as_user(&founder_1, &dao, proposal_id.clone(), 1);
    vote_as_user(&founder_2, &dao, proposal_id.clone(), 1);

    //last founder votes twice
    let duplicit_vote = vote_as_user(&founder_2, &dao, proposal_id.clone(), 1);

    let duplicit_vote_result: String =
        if let ExecutionStatus::SuccessValue(v) = duplicit_vote.status() {
            std::str::from_utf8(v.as_slice()).unwrap().parse().unwrap()
        } else {
            panic!("Execution status is not success");
        };

    assert_eq!(duplicit_vote_result, "\"AlreadyVoted\"".to_string());

    vote_as_user(&founder_3, &dao, proposal_id.clone(), 1);

    let t2 = root.borrow_runtime().current_block().block_timestamp;

    //factory account calls finish
    let call_finish_proposal = factory.call(
        dao.account_id(),
        "finish_proposal",
        &json!({ "proposal_id": proposal_id.clone() })
            .to_string()
            .into_bytes(),
        GAS_FINISH_PROPOSAL,
        0,
    );

    let t3 = root.borrow_runtime().current_block().block_timestamp;

    let proposal_end_result: String =
        if let ExecutionStatus::SuccessValue(v) = call_finish_proposal.status() {
            std::str::from_utf8(v.as_slice()).unwrap().parse().unwrap()
        } else {
            panic!("Execution status is not success, result: {:?}", call_finish_proposal.status());
        };

    assert_eq!(proposal_end_result, "\"Accepted\"".to_string());

    let call_eva_ft_balance_before = root.view(
        dao.account_id(),
        "ft_balance_of",
        &json!({"account_id": eva.account_id()})
            .to_string()
            .into_bytes(),
    );

    assert!(call_eva_ft_balance_before.is_ok());
    assert_eq!(
        call_eva_ft_balance_before
            .unwrap_json_value()
            .as_str()
            .unwrap(),
        "0"
    );

    let view_statistics_members = eva.view(
        dao.account_id(),
        "group_members",
        &json!({"group": "Insiders"}).to_string().into_bytes(),
    );
    assert!(view_statistics_members.is_ok());
    assert_eq!(
        view_statistics_members.unwrap_json_value().as_array().unwrap(),
        &vec![
            FOUNDER_1.to_string(),
            FOUNDER_2.to_string(),
            FOUNDER_3.to_string(),
            EVA.to_string()
        ]
    );
}