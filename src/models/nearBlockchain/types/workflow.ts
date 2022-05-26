import { VoteScenario } from "./dao";

export type Datatype  = { "bool": boolean } | { "u64": boolean } | { "u128": boolean } | { "string": boolean } | "vec_u64" | "vec_u128" | "vec_string" | { "object": number } | { "nullable_object": number } | { "vec_object": number }

export type Value = "null" | { "bool": boolean } | { "u64": number } | { "u128": string } | { "string": string } | { "vec_bool": boolean[] } | { "vec_u64": number[] } | { "vec_u128": string[] } | { "vec_string": string[] }

/*
define function call receiver account id and function call name
array of two elements where:
0th pos is string (valid account_id) 
1th pos is string (name of function call method)
*/
export type FnCallId = [string, string]

/*
define function call inputs
*/
export type ObjectMetadata = {
    arg_names: string[]; // names of the keys
    arg_types: Datatype[]; // datatypes of the keys
}

/*
define all necessary data structures for workflow.
array of 4 elements where:
0th pos is Template object
1th pos is FnCallId[]
2th pos is ObjectMetadata[][]
3th pos is MethodName[] - standard function calls used in the template
 */
export type TemplateData = [Template, FnCallId[], ObjectMetadata[][], MethodName[]]

export type Template = {
    code: string;
    version: string;
    /// Workflow can be auto-executed.
    auto_exec: boolean;
    need_storage: boolean;
    /// First activity is init activity as workflow might diverge from init.
    activities: Activity[];
    /// Expressions shared for all template entities.
    expressions: EExpr[];
    /// Index of transition is id of activity from.
    transitions: Transition[][];
    // TODO figure out structure.
    constants: SourceDataVariant;
    /// Ids of activities which make possible to finish workflow when their are successfully executed.
    end: number[];
}

export type MethodName = "ft_transfer" |  "ft_transfer_call" |  "nft_transfer" |  "nft_transfer_call" |  "storage_deposit" |  "storage_withdraw" |  "storage_unregister"

// define workflow security settings
// eg. who can propose, vote, who can execute which activity, transition limits etc... 
export type TemplateSettings = {
    allowed_proposers: ActivityRight[];
    allowed_voters: ActivityRight;
    // Activity right per transition
    activity_rights: ActivityRight[][];
    transition_limits: TransitionLimit[][];
    scenario: VoteScenario;
    duration: number;
    quorum: number;
    approve_threshold: number;
    spam_threshold: number;
    vote_only_once: boolean;
    deposit_propose: string|null; // numeric string
    deposit_vote:  string|null; // numeric string
    deposit_propose_return: number;
    constants: SourceDataVariant|null;
}

// define inputs for workflow that are created when proposal is being proposed
export type ProposeSettings = {
    // Top level binds. Shared across all activities.
    constants: SourceDataVariant|null;
    // Bind per activity. Init activity's binds must be on 0th pos and null.
    activity_constants: ActivityBind|null[];
    // Storage key under which is the workflow data storage created.
    storage_key: string|null; // must if unique string if Template's key "need_storage" is true
}

export type SourceDataVariant = {map: Record<string, Value>}

export type ActivityBind = {
    // Binds shared for all actions.
    constants: SourceDataVariant|null;
    // Bind per activity actions.
    actions_constants: (SourceDataVariant|null)[];
}

/**
 * Provider
 */
export type Metadata = {
    id: number;
    code: string;
    version: string;
    fncalls: FnCallId[];
    standard_fncalls: string[];
    help: boolean;
}


/**
 * TODO: Add types
 */

export type Activity = {

}

export type ActivityRight =
    "anyone" | "token_holder" | "member"
    | {group: number;} | {group_member: [number, string];} | {group_role: [number, number];} | {group_leader: number;}
    | {account:string;}
 
export type EExpr = {

}


export type Transition = {

}


export type TransitionLimit = {
    to: number;
    limit: number;
}