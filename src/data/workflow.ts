import { WFAction, WFInstance, WFSettings, WFTemplate } from "@/types/workflow"
import { rightMember, rightAnyone, rightTokenGroupCouncil, votingTokenWeightedLow } from "@/data/dao"
import { toSearch } from "@/utils/string"
import moment from "moment"

export const actionDAOSendNear: WFAction = {id: 1, name: 'Treasury: Send NEAR', code: 'sendNear', smartContractMethod: 'treasury_send_near' }
export const actionDAOSendToken: WFAction = {id: 2,  name: 'Treasury: Send Token', code: 'sendToken', smartContractMethod: 'treasury_send_token' }
export const actionDAOCreateGroup: WFAction = {id: 3,  name: 'Create group', code: 'groupCreate', smartContractMethod: 'group_create' }
export const actionDAOAddMember: WFAction = {id: 4,  name: 'Add member to group', code: 'groupAddMember', smartContractMethod: 'group_add_member' }

export const templatePayoutSettings: WFSettings = {
  id: 1,
  constants: [
    { code: 'nearAmountLimit', value: '1000.0' },
    { code: 'tokenAmountLimit', value: '10000.0' },
  ],
  proposeRights: [rightMember, rightAnyone],
  voteRight: rightMember,
  voteLevel: votingTokenWeightedLow,
  activities: [
    { activityId: 1, rights: [rightTokenGroupCouncil] },
    { activityId: 2, rights: [rightTokenGroupCouncil] },
  ]
}

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
      { id: 1, name: 'Payout NEAR', code: 'payoutNear', attributes: [{ code: 'amount', name: 'Amount' }], actions: [actionDAOSendNear] },
      { id: 2, name: 'Payout TOKEN', code: 'payoutToken', attributes: [{ code: 'amount', name: 'Amount' }], actions: [actionDAOSendToken] }
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