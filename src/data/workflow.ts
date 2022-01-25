import { WFInstance } from "@/types/workflow"
import { toSearch } from "@/utils/string"
import moment from "moment"

export const payoutAtStart: WFInstance = {
  id: 1,
  name: 'Payout',
  code: 'daoPayout',
  state: 'inProgress',
  inputs: [
    { code: 'nearAmount', name: 'NEAR Amount', value: '500.0' },
    { code: 'receiverId', name: 'Receiver ID', value: 'pstu.near' }
  ],
  activitiesNext: [
    {
      id: 1,
      name: 'Payout NEAR',
      code: 'payoutNear',
      rank: 1,
      smartContractId: 'genesis.neardao.near',
      inputs: [
        { code: 'amount', name: 'Amount', value: '' },
        { code: 'receiverId', name: 'Receiver ID', value: 'pstu.near' }
      ],
      action: [
        {name: 'Treasury send NEAR', smartContractMethod: 'treasury_send_near'}
      ],
    }
  ],
  activitiesLog: [
  ],
  end: [
    'payoutNear'
  ],
  search: toSearch('Payout pstu.near')
}

export const payoutAfterPayNear: WFInstance = {
  id: 2,
  name: 'Payout',
  code: 'daoPayout',
  state: 'inProgress',
  inputs: [
    { code: 'nearAmount', name: 'NEAR Amount', value: '700.0' },
    { code: 'receiverId', name: 'Receiver ID', value: 'jsla.near' }
  ],
  activitiesNext: [
    {
      id: 2,
      name: 'PayoutNEAR',
      code: 'payoutNear',
      rank: 2,
      smartContractId: 'genesis.neardao.near',
      inputs: [
        { code: 'amount', name: 'NEAR Amount', value: '' },
        { code: 'receiverId', name: 'Receiver ID', value: 'jsla.near' }
      ],
      action: [
        {name: 'Treasury send NEAR', smartContractMethod: 'treasury_send_near'}
      ],
    }
  ],
  activitiesLog: [
    {
      id: 1,
      name: 'Payout NEAR',
      code: 'payoutNear',
      rank: 1,
      smartContractId: 'genesis.neardao.near',
      txSignedAt: moment().subtract(1, 'M').toDate(),
      inputs: [
        { code: 'amount', name: 'NEAR Amount', value: '250.0' },
        { code: 'receiverId', name: 'Receiver ID', value: 'jsla.near' }
      ],
      action: [
        {name: 'Treasury send NEAR', smartContractMethod: 'treasury_send_near'}
      ],
    }
  ],
  end: [
    'payoutNear'
  ],
  search: toSearch('Payout jsla.near')
}

export const payoutFinished: WFInstance = {
  id: 3,
  name: 'Payout',
  code: 'daoPayout',
  state: 'finished',
  inputs: [
    { code: 'nearAmount', name: 'NEAR Amount', value: '500.0' },
    { code: 'receiverId', name: 'Receiver ID', value: 'pfil.near' }
  ],
  activitiesNext: [
  ],
  activitiesLog: [
    {
      id: 1,
      name: 'Payout NEAR',
      code: 'payoutNear',
      rank: 1,
      smartContractId: 'genesis.neardao.near',
      txSignedAt: moment().subtract(10, 'd').toDate(),
      inputs: [
        { code: 'amount', name: 'Amount', value: '500.0' },
        { code: 'receiverId', name: 'ReceiverID', value: 'pfil.near' }
      ],
      action: [
        {name: 'Treasury send NEAR', smartContractMethod: 'treasury_send_near'}
      ],
    }
  ],
  end: [
    'payoutNear'
  ],
  search: toSearch('Payout pfil.near')
}