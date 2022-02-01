import { WFInstance, WFSettings, WFTemplate } from "@/types/workflow"
import { rightMember, rightTokenGroupCouncil, votingTokenWeightedLow } from "@/data/dao"
import { toSearch } from "@/utils/string"
import moment from "moment"

export const actionDAOSendNear = { name: 'Treasury: Send NEAR', code: 'sendNear', smartContractMethod: 'treasury_send_near' }
export const actionDAOSendToken = { name: 'Treasury: Send Token', code: 'sendToken', smartContractMethod: 'treasury_send_token' }
export const actionDAOCreateGroup = { name: 'Create group', code: 'groupCreate', smartContractMethod: 'group_create' }
export const actionDAOAddMember = { name: 'Add member to group', code: 'groupAddMember', smartContractMethod: 'group_add_member' }

export const templatePayout: WFTemplate = {
    id: 1,
    name: 'Payout',
    version: '1.0',
    code: 'payout',
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
      { id: 1, fromId: 2, toId: 1}
    ],
    startActivityIds: [1,2],
    endActivityIds: [1,2],
    search: toSearch('Payout NEAR TOKEN'),
}

export const templateCreateGroup: WFTemplate = {
  id: 2,
  name: 'Create GROUP',
  version: '1.0',
  code: 'groupCreate',
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
}

export const templateAddMember: WFTemplate = {
  id: 3,
  name: 'Add member to group',
  version: '1.0',
  code: 'addMemberToGroup',
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
}

export const templatePayoutSettings: WFSettings = {
  id: 1,
  template: templatePayout,
  inputs: [],
  proposeRights: [rightMember],
  voteRight: rightMember,
  voteLevel: votingTokenWeightedLow,
  activities: [
    { activityId: 1, rights: [rightTokenGroupCouncil] },
    { activityId: 2, rights: [rightTokenGroupCouncil] }
  ]
}

export const payoutAtStart: WFInstance = {
  id: 1,
  settings: templatePayoutSettings,
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
  settings: templatePayoutSettings,
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
  settings: templatePayoutSettings,
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