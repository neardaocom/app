export type ProposalState = "in_progress" | "invalid" | "spam" | "rejected" | "accepted"
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

export type Settings = {
    name: string;
    purpose: string;
    tags: number[],
    dao_admin_account_id: string; // valid account_id
    dao_admin_rights: string;
    workflow_provider: string; // valid account_id
    resource_provider: string; // valid account_id
    scheduler: string; // valid account_id
}

export type TagInput = {
    category: string;
    values: string[];
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
    settings: GroupSettings,
    members: GroupMember[],
    member_roles: Record<string, string[]>, // keys are group role names, values are account ids for the role
}

type AssetFT = {
    account_id: string;
    decimals: integer;
}

type AssetNFT = {
    account_id: string;
    token_id: string;
    approval_id: integer|null;
}

type Asset = "near" | {"ft": AssetFT} | {"nft": AssetNFT}

export type CreateDao = {
    token_id: string;
    staking_id: string;
    total_supply: integer,
    decimals: integer,
    settings: Settings,
    groups: GroupInput[],
    tags: TagInput[],
    standard_function_calls: MethodName[],
    standard_function_call_metadata: ObjectMetadata[][],
    function_calls: FnCallId[],
    function_call_metadata: ObjectMetadata[],
    workflow_templates: Template[],
    workflow_template_settings: TemplateSettings[][],
    treasury_partitions: Vec<TreasuryPartitionInput>,
}