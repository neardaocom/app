import { WFMetaTemplate, WFAction, WFInstance, WFSettings, WFTemplate, WFData } from "@/types/workflow"
import { rightMember, rightAnyone, rightTokenGroupCouncil, votingTokenWeightedLow } from "@/data/dao"
import { toSearch } from "@/utils/string"
import moment from "moment"
import { DAORights } from "@/types/dao"
import { toObject } from "@/models/rights";

export const templateMetaPayout: WFMetaTemplate = {
    settingsAttributes: [
      { code: 'amountLimit', bindId: 0 },
      { code: 'tokenLimit', bindId: 1 },
    ],
    proposalAttributes: [
      { code: 'receiverId', bindId: 0 },
      { code: 'nearAmount', bindId: 1 },
      { code: 'tokenAmount', bindId: 2 },
    ],
    activities: [],
}

export const templateMetaSendNear: WFMetaTemplate = {
  settingsAttributes: [
    { code: 'amountLimit', bindId: 0 },
  ],
  proposalAttributes: [
    { code: 'receiverId', bindId: 0 },
    { code: 'amount', bindId: 1 },
  ],
  activities: [],
}

export const templateMetaSendFt: WFMetaTemplate = {
  settingsAttributes: [
    { code: 'amountLimit', bindId: 0 },
  ],
  proposalAttributes: [
    { code: 'receiverId', bindId: 0 },
    { code: 'amount', bindId: 1 },
  ],
  activities: [],
}

export const templateMetaGroupAddMember: WFMetaTemplate = {
  settingsAttributes: [
  ],
  proposalAttributes: [
    { code: 'accountId', bindId: 0 },
    { code: 'groupId', bindId: 1 },
    { code: 'roles', bindId: 2 },
  ],
  activities: [],
}

export const templateMetaGroupRemoveMember: WFMetaTemplate = {
  settingsAttributes: [
  ],
  proposalAttributes: [
    { code: 'accountId', bindId: 0 },
    { code: 'groupId', bindId: 1 },
  ],
  activities: [],
}

export const templateMetaMediaAdd: WFMetaTemplate = {
  settingsAttributes: [
  ],
  proposalAttributes: [
    { code: 'name', bindId: 0 },
    { code: 'category', bindId: 1 },
    { code: 'type', bindId: 2 },
    { code: 'version', bindId: 3 },
    { code: 'tags', bindId: 4 },
    { code: 'cid', bindId: 5 },
    { code: 'link', bindId: 6 },
  ],
  activities: [],
}

export const templateMetaMediaInvalid: WFMetaTemplate = {
  settingsAttributes: [
  ],
  proposalAttributes: [
    { code: 'id', bindId: 0 },
  ],
  activities: [],
}

export const templateMetaFtUnlockDistribute: WFMetaTemplate = {
  settingsAttributes: [
    { code: 'groupIds', bindId: 0 },
    { code: 'amountLimit', bindId: 1 },
  ],
  proposalAttributes: [
    { code: 'groupId', bindId: 0 },
    { code: 'amount', bindId: 1 },
    { code: 'accountIds', bindId: 2 },
  ],
  activities: [],
}

export const templateMetaSkyward: WFMetaTemplate = {
  settingsAttributes: [
    { code: 'amountLimit', bindId: 0 },
  ],
  proposalAttributes: [
    { code: 'title', bindId: 0 },
    { code: 'amount', bindId: 1 },
    { code: 'tokenId', bindId: 2 },
    { code: 'startAt', bindId: 3 },
    { code: 'duration', bindId: 4 },
  ],
  activities: [],
}

export const templateMetaGeneral: WFMetaTemplate = {
  settingsAttributes: [
  ],
  proposalAttributes: [
    { code: 'title', bindId: 0 },
    { code: 'cid', bindId: 1 },
  ],
  activities: [],
}

export const templateMetaAddWorkflow: WFMetaTemplate = {
  settingsAttributes: [
  ],
  proposalAttributes: [
    { code: 'templateId', bindId: 0 },
    { code: 'settings...', bindId: 1 },
  ],
  activities: [],
}

export const templateMeta: Record<string, WFMetaTemplate> = {
  'payout': templateMetaPayout,
  'groupAddMember': templateMetaGroupAddMember,
  'groupRemoveMember': templateMetaGroupRemoveMember,
  'mediaAdd': templateMetaMediaAdd,
  'mediaInvalid': templateMetaMediaInvalid,
  'FtNulockDistribute': templateMetaFtUnlockDistribute,
  'skyward': templateMetaSkyward,
  'general': templateMetaGeneral,
  'addWorkflow': templateMetaAddWorkflow,
  'wf_add': templateMetaAddWorkflow,
  'wf_send_near': templateMetaSendNear,
  'wf_near_send': templateMetaSendNear,
  'wf_send_ft': templateMetaSendFt,
}

export const actionDAOTreasurySendNear: WFAction = { id: 1, activityId: 1, method: 'treasury_send_near', gas: 10, deposit: 0, }

export const actionDAOTreasurySendFt: WFAction = { id: 2, activityId: 1, method: 'treasury_send_ft', gas: 10, deposit: 0, }


export const actionDAOGroupCreate: WFAction = {id: 3, activityId: 1, method: 'group_create', gas: 10, deposit: 0,}
export const actionDAOGroupAddMember: WFAction = {id: 4, activityId: 1, method: 'group_add_member', gas: 10, deposit: 0,}

export const actionMetas: Record<string, WFAction> = {
  treasury_send_near: actionDAOTreasurySendNear,
}

export const templatePayoutSettings: WFSettings = {
  id: 1,
  proposeRights: [rightMember, rightAnyone],
  voteRight: rightMember,
  voteLevel: votingTokenWeightedLow,
  actionRights: [
    { actionId: 1, rights: [rightTokenGroupCouncil] },
    { actionId: 2, rights: [rightTokenGroupCouncil] },
  ]
}

/*
export const templatePayout: WFTemplate = {
    id: 1,
    name: 'Payout',
    version: '1.0',
    code: 'payout',
    constants: [
      { code: 'nearAmountLimit', name: 'NEAR Amount - limit' },
      { code: 'tokenAmountLimit', name: 'TOKEN Amount - limit' },
    ],
    attributes: [
      { code: 'receiverId', name: 'ReceiverId' },
      { code: 'nearAmount', name: 'NEAR Amount' },
      { code: 'tokenAmount', name: 'TOKEN Amount' },
    ],
    activities: [
      { id: 1, name: 'Payout NEAR', code: 'payoutNear', attributes: [{ code: 'amount', name: 'Amount' }], actions: [actionDAOTreasurySendNear] },
      { id: 2, name: 'Payout TOKEN', code: 'payoutToken', attributes: [{ code: 'amount', name: 'Amount' }], actions: [actionDAOTreasurySendFt] }
    ],
    transactions: [
      { id: 1, fromId: 1, toId: 2},
      { id: 2, fromId: 1, toId: 1},
      { id: 3, fromId: 2, toId: 1},
      { id: 4, fromId: 2, toId: 2}
    ],
    startActivityIds: [1,2],
    endActivityIds: [1,2],
    search: toSearch('Payout NEAR TOKEN'),
    settings: [ templatePayoutSettings ],
}

export const templateCreateGroup: WFTemplate = {
  id: 2,
  name: 'Create GROUP',
  version: '1.0',
  code: 'groupCreate',
  constants: [],
  attributes: [
    { code: 'name', name: 'Name' },
    { code: 'tokenUnlocking', name: 'Token unlocking' },
  ],
  activities: [
    { id: 1, name: 'Create', code: 'create', attributes: [], actions: [actionDAOCreateGroup] },
  ],
  transactions: [
  ],
  startActivityIds: [1],
  endActivityIds: [1],
  search: toSearch('Create Group'),
  settings: [ ],
}

export const templateAddMember: WFTemplate = {
  id: 3,
  name: 'Add member to group',
  version: '1.0',
  code: 'addMemberToGroup',
  constants: [],
  attributes: [
    { code: 'accountId', name: 'Account ID' },
    { code: 'groupId', name: 'Group ID' },
  ],
  activities: [
    { id: 1, name: 'Add member', code: 'addMember', attributes: [], actions: [actionDAOAddMember] },
  ],
  transactions: [
  ],
  startActivityIds: [1],
  endActivityIds: [1],
  search: toSearch('Add Member Group'),
  settings: [],
}

export const payoutAtStart: WFInstance = {
  id: 1,
  templateId: 1,
  settingsId: 1,
  state: 'inProgress',
  constants: [],
  inputs: [
    { code: 'receiverId', value: 'pstu.near' },
    { code: 'nearAmount', value: '500.0' },
  ],
  activityNextIds: [1],
  activityLogs: [],
  search: toSearch('Payout pstu.near'),
}

export const payoutAfterPayNear: WFInstance = {
  id: 2,
  templateId: 1,
  settingsId: 1,
  state: 'inProgress',
  constants: [],
  inputs: [
    { code: 'receiverId', value: 'jsla.near' },
    { code: 'nearAmount', value: '700.0' },
    { code: 'tokenAmount', value: '500.0' },
  ],
  activityNextIds: [1, 2],
  activityLogs: [
    {
      id: 1,
      activityId: 1,
      rank: 1,
      txHash: 'A8DpeeFCiQEaBfjJUjiMTALAwLZnPvdCp8yVseckoYPJ',
      txSigner: 'runner.dao.near',
      txSignedAt: moment().subtract(1, 'M').toDate(),
      inputs: [
        { code: 'amount', value: '250.0' },
      ],
    },
    {
      id: 2,
      activityId: 2,
      rank: 2,
      txHash: 'A8DpeeFCiQEaBfjJUjiMTALAwLZnPvdCp8yVseckoYPJ',
      txSigner: 'runner.dao.near',
      txSignedAt: moment().subtract(20, 'd').toDate(),
      inputs: [
        { code: 'amount', value: '250.0' },
      ],
    }
  ],
  search: toSearch('Payout jsla.near'),
}

export const payoutFinished: WFInstance = {
  id: 3,
  templateId: 1,
  settingsId: 1,
  state: 'finished',
  constants: [],
  inputs: [
    { code: 'receiverId', value: 'pfil.near' },
    { code: 'nearAmount', value: '500.0' },
  ],
  activityNextIds: [],
  activityLogs: [
    {
      id: 1,
      activityId: 1,
      rank: 1,
      txHash: '2ZzcVSw75h4VFAsYiPJqPnUppYkcfuRZ6vULzevZrKkA',
      txSigner: 'runner.dao.near',
      txSignedAt: moment().subtract(10, 'd').toDate(),
      inputs: [
        { code: 'amount', value: '500.0' },
      ],
    }
  ],
  search: toSearch('Payout pfil.near'),
}
*/

export const workflowTemplateWfAdd: Record<string, unknown> = {
  name:"wf_add",
  version:1,
  activities:[
    null,
    {
      code:"wf_add",
      exec_condition:null,
      action:"WorkflowAdd",
      fncall_id:null,
      tgas:0,
      deposit:0,
      arg_types:[{"U16":false},{"Object":0}],
      activity_inputs: [ [ { Bind: 0 } ] ],
      postprocessing:null
    }
  ],
  transitions:[[1]],
  binds:[],
  start:[0],
  end:[1],
  obj_validators: [[{"Primitive":0}]],
  validator_exprs: [{"args":[{"User":0},{"Bind":0}],"expr":{"Boolean":{"operators":[{"operands_ids":[0,1],"op_type":{"Rel":"Eqs"}}],"terms":[{"Arg":1},{"Arg":0}]}}}],
};

export const workflowTemplateWfNearSend: Record<string, unknown> = {
  name:"wf_near_send",
  version:1,
  activities:[
    null,
    {
      code:"near_send",
      exec_condition:null,
      action:"TreasuryNearSend",
      fncall_id:null,
      tgas:0,
      deposit:0,
      arg_types:[{String:false},{U128:false}],
      activity_inputs: [ [ 'Free', 'Free' ] ],
      postprocessing:null
    }
  ],
  transitions:[[1]],
  binds:[],
  start:[0],
  end:[1],
  obj_validators:[[{"Primitive":0},{"Primitive":0}]],
  validator_exprs:[{"args":[{"User":0},{"Bind":0}],"expr":{"Boolean":{"operators":[{"operands_ids":[0,1],"op_type":{"Rel":"Eqs"}}],"terms":[{"Arg":1},{"Arg":0}]}}},{"args":[{"User":1},{"Bind":1}],"expr":{"Boolean":{"operators":[{"operands_ids":[0,1],"op_type":{"Rel":"GtE"}}],"terms":[{"Arg":1},{"Arg":0}]}}}]
};

export const worlflowTemplateSettingsBuilder = (
  transitionConstraints: any,
  canVote: DAORights,
  canPropose: DAORights[],
  activityRights: DAORights[][],
  duration: number,
  quorum: number,
  approveThreshold: number,
  depositPropose: string, // TODO: string
  depositVote: string, // TODO: string
  depositProposeReturn: number
): Record<string, unknown> => ({
    transition_constraints: transitionConstraints,
    allowed_proposers: canPropose.map((right) => toObject(right)),
    allowed_voters: toObject(canVote),
    activity_rights: activityRights.map((rights: DAORights[]) => rights.map((right) => toObject(right))),
    scenario: "TokenWeighted",
    duration: duration,
    quorum: quorum,
    approve_threshold: approveThreshold,
    spam_threshold: 80, // ??
    vote_only_once: true,
    deposit_propose: depositPropose,
    deposit_vote: depositVote,
    deposit_propose_return: depositProposeReturn
})