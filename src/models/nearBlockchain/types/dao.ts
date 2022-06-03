import { Media, ResourceType } from "./resource";
import { MethodName, ObjectMetadata, FnCallId, Template, TemplateSettings } from "./workflow";

export type VersionedProposal = { "current": Proposal }

export type ProposalState = "in_progress" | "invalid" | "spam" | "rejected" | "accepted"
export type VoteScenario = "democratic" | "token_weighted"
export type VoteResult = "ok" | "already_voted" | "no_rights" | "invalid_vote" | "vote_ended"

export type Proposal = {
    desc: number; // resource id on resource provider // Not implemented yet!
    created: number; // linux timestamp in seconds
    created_by: string; // proposer account id
    end: number; // tinux timestamp in seconds
    votes: Record<string, number>; // map account id -> vote value
    state: ProposalState; // enum - string
    workflow_id: number; // proposed workflow id
    workflow_settings_id: number; // proposed workflow id - template settings id
}

export type ProposalInputs = {
    description: ResourceType | null;
    template_id: number;
    template_settings_id: number;
    propose_settings: ProposeSettings;
    template_settings: TemplateSettings[] | null;
    scheduler_msg: string | null;
  }

export type Settings = {
    name: string;
    purpose: string;
    tags: number[],
    dao_admin_account_id: string; // valid account_id
    dao_admin_rights: string[];
    workflow_provider: string; // valid account_id
    resource_provider: string; // valid account_id
    scheduler: string; // valid account_id
    token_id: string;
    staking_id: string;
}

export type TagInput = {
    category: string;
    values: string[];
}

export type Tag = any // TODO: Write type

export type Tags = {
    last_id: number;
    map: Tag[];
}

export type GroupSettings = {
    name: string;
    leader: string|null; // valid account_id
    parent_group: number;
}

export type GroupMember = {
    account_id: string; // valid account_id,
    tags: number[]; // array of tag references
}

export type GroupInput = {
    settings: GroupSettings;
    members: GroupMember[];
    member_roles: { name: string, members: string[]}[]; // keys are group role names, values are account ids for the role
}

export type Asset = "near" | {"ft": AssetFT} | {"nft": AssetNFT}

export type AssetFT = {
    account_id: string;
    decimals: number;
}

export type AssetNFT = {
    account_id: string;
    token_id: string;
    approval_id: number|null;
}

export type UnlockPeriodInput = {
    type: UnlockMethod; // string - "none" or "linear"
    duration: number; // seconds
    amount: number; // number amount of tokens to be unlocked in the period
}

export type LockInput = {
    amount_total_lock: number; //
    start_from: number; // linux timestamp in seconds
    duration: number; // seconds
    periods: UnlockPeriodInput[];
 }

 export type UnlockingInput = {
    amount_init_unlock: number;
    lock: LockInput|null;
}

export type PartitionAssetInput = {
    asset_id: Asset;
    unlocking: UnlockingInput;
}

export type TreasuryPartitionInput = {
    name: string;
    assets: PartitionAssetInput[];
}

export type PartitionAsset = {
    asset_id: Asset;
    amount: number; // big int - free amount with decimals
    lock: UnlockingDB|null;
}

export type TreasuryPartition = {
    name: string;
    assets: PartitionAsset[];
}

export type UnlockMethod = "none" | "linear"

export type UnlockPeriod = {
    type: UnlockMethod;
    end_at: number; // linux timestamp in seconds
    amount: number; 
}

export type UnlockingDB = {
    amount_available_unlocked: number;
    // Amount of tokens unlocked during creation.
    amount_init_unlocked: number;
    lock: Lock;
}

// define unlocking model
export type Lock = {
    amount_total_locked: number;
    amount_total_unlocked: number;
    start_from: number; // linux timestamp in seconds
    duration: number; // seconds
    periods: UnlockPeriod[];
    pos: number; // current period
    current_period_unlocked: number; // amount of already unlocked in current period
}

// define how many seconds is one unit
export type RewardWage = {
    unit_seconds: number;
}

// define which activities are rewarded
export type RewardActivity = {
    activity_ids: number[];
}

export type RewardType = {"wage": RewardWage} | {"user_activity": RewardActivity}

// dao defined reward for group role
export type Reward = {
    group_id: number;
    role_id: number;
    partition_id: number;
    type: RewardType;
    reward_amounts: any[]; // eg. [[Asset object, number],[Asset object, number], ...]
    time_valid_to: number; // linux timestamp in seconds
    time_valid_from: number; // linux timestamp in seconds
}

export type ClaimbleReward = {
    asset: Asset;
    reward_id: number;
    amount: string; // numeric string
    partition_id: number;
}

// reference to Reward in Wallet and withdraw statistics
export type WalletReward = {
    reward_id: number;
    time_added: number; // linux timestamp in seconds
    withdraw_stats: WithdrawStats[];
}

export type RewardTypeIdent = "wage" | "activity"

export type WithdrawStats = {"wage": WageStats} | {"activity": ActivityStats} 

export type WageStats = {
    asset_id: Asset;
    amount: number; // big int
    timestamp_last_withdraw: number; // linux timestamp in seconds
}

export type ActivityStats = {
    asset_id: Asset;
    executed_count: number;
    total_withdrawn_count: number;
    timestamp_last_withdraw: number; // linux timestamp in seconds
}


export type Wallet = {
    rewards: WalletReward[];
    failed_withdraws: any[]; // eg. [[Asset object, 100,],[Asset object, 200,] ..]
}

// used for group roles
export type Roles = {
    last_id: number; // > 0
    map: Record<number,string>; // map role id -> role name
}

// Object where key is group_id, and values is array of role ids in the group.
export type UserRoles = Record<number, number[]> 

export type DaoActionIdent = "group_add" | "group_remove" | "group_update" | "group_add_members" | "group_remove_member" | "settings_update" | "tag_add" | "tag_edit" | "tag_remove" | "ft_distribute" | "workflow_add" | "treasury_add_partition" | "reward_add" | "event"

export type ActionInputType = {"dao_action": DaoActionIdent} | {"fn_call": [string, string]} | {"event": string} | "send_near" | "stake"

export type UserInput = {"map": Record<string, any>} // Value => any

export type ActionInput = {
    action: ActionInputType;
    values: UserInput;
}

export type InstanceState = "waiting" | "running" | "awaiting" | "fatal_error" | "finished"

export type TransitionCounter = {
    to: number; // id of activity
    count: number; // actual transition done count
    limit: number; // max transition done limit
}



// running workflow state
export type Instance = {
    state: InstanceState;
    last_transition_done_at: number; // linux timestamp in seconds
    current_activity_id: number; //activity id (pos) in template
    activities_done: [number, number][]; // array of arrays of two elements (activity id, action id)
    actions_done: number; // count of current activity actions done
    actions_total: number; // total count of actions in current activity
    template_id: number; // reference to workflow template in DAO
    end_activities: number[]; // id of activities that can be used to finish workflow
    current_autofinish: boolean; // flag if current activity can be autofinished
    dispatched_promises_count: number; // counter of dispatched promises
    transition_counters: TransitionCounter[][]; // counters for all transitions
}

export type CreateDao = {
    total_supply: number;
    decimals: number;
    settings: Settings;
    groups: GroupInput[];
    tags: TagInput[];
    standard_function_calls: MethodName[];
    standard_function_call_metadata: ObjectMetadata[][];
    function_calls: FnCallId[][]; // TODO: PSTU why to array?
    function_call_metadata: ObjectMetadata[][]; // TODO: PSTU why to array?
    workflow_templates: Template[];
    workflow_template_settings: TemplateSettings[][];
    treasury_partitions: TreasuryPartitionInput[];
    media: Media[];
}

export type Statistics = {
    staking_id: string; // staking contract account id
    token_id: string; // vote token contract account id
    total_delegation_amount: string; // total delegated amount - numeric string
    total_delegators_count: number; // total unique delegators count
    ft_total_supply: number; // total supply of minted ft - number
    decimals: number; // ft decimals count
    total_members_count:  number; // total unique members
    total_account_balance: string; // total NEAR on this account - numeric string
    free_account_balance: string; // free NEAR on this account - numeric string
}

/**
 * TODO: Add types
 */

export type ProposeSettings = any