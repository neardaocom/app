import _ from "lodash"

export const getPublicSalePercent = (council, community, investor) => {
  return 100 - (council ?? 0) - (community ?? 0) - (investor ?? 0)
}

export const getProposalKind = (proposal) => {
  return Object.keys(proposal.transactions.actions[0])[0] ?? null
}

export const getProposalTitle = (proposal) => {
  let title = null;
  switch (getProposalKind(proposal)) {
    case 'GeneralProposal': {
      title = proposal.transactions.actions[0].GeneralProposal.title
      break;
    }
    default:
      break;
  }
  return title;
}

export const getAccountIdPostfix = (accountId) => _.last(_.split(_.toString(accountId), '.'));



//import Decimal from 'decimal.js';
//import { Proposal, ProposalRaw, ProposalType } from 'types/proposal';
//import camelcaseKeys from 'camelcase-keys';
//import { convertDuration } from '../../utils';
//import { yoctoNear } from './constants';

/*
export const parseForumUrl = (url: string): string => {
  const a = url.replace(/\/$/, '').split('/');
  const last = a[a.length - 1];
  const secondLast = a[a.length - 2];
  let category = null;
  let subCategory = null;

  if (/^\d+$/.test(secondLast)) {
    category = secondLast;
    subCategory = last;
  } else if (/^\d+$/.test(last)) {
    category = last;
  }

  if (category === null) {
    return '';
  }

  return subCategory === null
    ? `/t/${category}`
    : `/t/${category}/${subCategory}`;
};

export const URLTest = (url) => {
  const regExp = /^(ftp|http|https):\/\/[^ "]+$/;
  const regExp2 = /^https:\/\/gov.near.org\/[a-z0-9\\/]+$/;

  return regExp.test(url) && regExp2.test(url);
};

export const mapProposalRawToProposal = (
  contractId: string,
  proposalRaw: ProposalRaw,
  itemIndex: number,
): Proposal => {
  let proposal: Pick<Proposal, 'votePeriodConvertedEndDate' | 'daoId' | 'id'> &
    ProposalRaw = {
    ...proposalRaw,
    votePeriodConvertedEndDate: convertDuration(proposalRaw.vote_period_end),
    daoId: contractId,
    id: itemIndex,
  };

  if (proposalRaw.kind.type === ProposalType.Payout) {
    const amountYokto = new Decimal(proposalRaw.kind.amount);

    proposal = {
      ...proposal,
      kind: {
        type: ProposalType.Payout,
        amount: amountYokto.div(yoctoNear).toFixed(2),
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (camelcaseKeys(proposal, { deep: true }) as any) as Proposal;
};
*/