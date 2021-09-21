use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

/// User provided config type
#[derive(Deserialize)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Clone, Debug, PartialEq, Serialize))]
#[serde(crate = "near_sdk::serde")]
pub struct ConfigInput {
    pub insiders_share: Option<u8>,
    pub foundation_share: Option<u8>,
    pub community_share: Option<u8>,
    pub description: Option<String>,
    pub vote_spam_threshold: Option<u8>, //how many percent of total tokens voters needed for proposal to go to spam, relative to voted token weight amount
}
#[derive(BorshDeserialize, BorshSerialize)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Clone, Debug, PartialEq))]
pub struct Config{
    pub insiders_share: u8,
    pub foundation_share: Option<u8>,
    pub community_share: Option<u8>,
    pub description: String,
    pub vote_spam_threshold: u8, //how many percent of total tokens voters needed for proposal to go to spam, relative to voted token weight amount
}

impl From<ConfigInput> for Config {
    fn from(input: ConfigInput) -> Self {
        Config {
            insiders_share: input.insiders_share.unwrap(),
            foundation_share: input.foundation_share,
            community_share: input.community_share,
            description: input.description.unwrap(),
            vote_spam_threshold: input.vote_spam_threshold.unwrap(),
        }
    }        
}