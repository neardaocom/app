use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};


#[derive(Deserialize)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Clone, Debug, PartialEq, Serialize))]
#[serde(crate = "near_sdk::serde")]
pub enum ReleaseModelInput {
        Voting,
}

#[derive(BorshSerialize, BorshDeserialize)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Clone, Debug, PartialEq))]
pub enum ReleaseModel {
    Voting,
}

impl ReleaseModel {
    pub fn get_release_amount(
        &mut self,
        current_time: u64,
        total_supply: u32,
        init_distribution: u32,
        already_released: u32,
    ) -> u32 {
        match self {
            Self::Voting => 0,
            _ => unimplemented!()
        }
    }
}
