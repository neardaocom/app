use near_sdk::serde::Serialize;
use near_sdk::{json_types::U128, near_bindgen, AccountId};

use crate::action::MemberGroup;
use crate::{core::*, proposal::Proposal};

#[near_bindgen]
impl NearDaoContract {
    pub fn statistics_ft(&self) -> StatsFT {
        StatsFT {
            total_supply: self.total_supply,
            init_distribution: self.init_distribution,
            decimals: self.ft_metadata.get().unwrap().decimals,
            total_released: U128::from(self.already_released_ft),
            free: U128::from(self.free_ft),
            insiders_ft_shared: self.release_db[INDEX_RELEASED_INSIDERS as usize],
            community_ft_shared: self.release_db[INDEX_RELEASED_COMMUNITY as usize],
            foundation_ft_shared: self.release_db[INDEX_RELEASED_FOUNDATION as usize],
            parent_shared: self.release_db[INDEX_RELEASED_PARENT as usize],
            owner_shared: self.release_db[INDEX_RELEASED_OWNER as usize],
        }
    }

    pub fn statistics_members(self) -> StatsMembers {
        StatsMembers {
            owner: self.owner,
            insiders: self.insiders.to_vec(),
            foundation: self.foundation.to_vec(),
            community: self.community.to_vec(),
            insiders_share_percent: self.config.insiders_share,
            foundation_share_percent: self.config.foundation_share.unwrap_or_default(),
            community_share_percent: self.config.community_share.unwrap_or_default(),
            insiders_ft_shared: self.release_db[INDEX_RELEASED_INSIDERS as usize],
            community_ft_shared: self.release_db[INDEX_RELEASED_COMMUNITY as usize],
            foundation_ft_shared: self.release_db[INDEX_RELEASED_FOUNDATION as usize],
            registered_user_count: self.registered_accounts_count
        }
    }

    pub fn registered_user_count(&self) -> u32 {
        self.registered_accounts_count
    }

    pub fn proposal(&self, proposal_id: u32) -> Option<Proposal> {
        self.proposals.get(&proposal_id)
    }

    pub fn proposals(&self, from_index: u64, limit: u64) -> Vec<(u32, Proposal)> {
        let keys = self.proposals.keys_as_vector();
        let values = self.proposals.values_as_vector();
        (from_index..std::cmp::min(from_index + limit, self.proposals.len()))
            .map(|index| (keys.get(index).unwrap(), values.get(index).unwrap()))
            .collect()
    }

    pub fn dao_fees(self) -> DaoFee {
        DaoFee {
            min_gas_add_proposal: U128::from(GAS_ADD_PROPOSAL as u128),
            min_gas_vote: U128::from(GAS_VOTE as u128),
            min_gas_finish_proposal: U128::from(GAS_FINISH_PROPOSAL as u128),
            min_yocto_near_add_proposal: U128::from(DEPOSIT_ADD_PROPOSAL),
            min_yocto_near_vote: U128::from(DEPOSIT_VOTE),
        }
    }

    pub fn payments(self) -> Vec<RegularPayment> {
        self.regular_payments.to_vec()
    }

    pub fn group_members(self, group: MemberGroup) -> Vec<AccountId> {
        match group {
            MemberGroup::Insiders => {
                self.insiders.to_vec()
            },
            MemberGroup::Foundation => {
                self.foundation.to_vec()
            },
            MemberGroup::Community => {
                self.community.to_vec()
            },
            _ => unimplemented!(),
        }
    }
}
#[derive(Serialize)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Debug, PartialEq))]
#[serde(crate = "near_sdk::serde")]
pub struct StatsFT {
    pub total_supply: u32,
    pub init_distribution: u32,
    pub decimals: u8,
    pub total_released: U128,
    pub free: U128,
    pub insiders_ft_shared: u32,
    pub community_ft_shared: u32,
    pub foundation_ft_shared: u32,
    pub parent_shared: u32,
    pub owner_shared: u32,
}

#[derive(Serialize)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Debug, PartialEq))]
#[serde(crate = "near_sdk::serde")]
pub struct StatsMembers {
    owner: AccountId,
    insiders: Vec<AccountId>,
    foundation: Vec<AccountId>,
    community: Vec<AccountId>,
    insiders_share_percent: u8,
    foundation_share_percent: u8,
    community_share_percent: u8,
    insiders_ft_shared: u32,
    community_ft_shared: u32,
    foundation_ft_shared: u32,
    registered_user_count: u32,
}

#[derive(Serialize)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Debug, PartialEq))]
#[serde(crate = "near_sdk::serde")]
pub struct DaoFee {
    min_gas_add_proposal: U128,
    min_gas_vote: U128,
    min_gas_finish_proposal: U128,
    min_yocto_near_add_proposal: U128,
    min_yocto_near_vote: U128,
}
