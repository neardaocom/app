import _ from "lodash"

export const getPublicSalePercent = (council: number, community: number, investor: number): number => {
  return 100 - (council ?? 0) - (community ?? 0) - (investor ?? 0)
}

export const getProposalKind = (proposal: any): string => {
  return Object.keys(proposal.transactions.actions[0])[0] ?? null
}

export const getProposalTitle = (proposal: any): string | undefined => {
  let title: string = '';
  switch (getProposalKind(proposal)) {
    case 'GeneralProposal':
      title = proposal.transactions.actions[0].GeneralProposal.title
      break;
    default:
      break;
  }
  return title;
}

export const getAccountIdPostfix = (accountId: string): string | undefined => _.last(_.split(_.toString(accountId), '.'));