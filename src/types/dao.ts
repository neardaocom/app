import { IPFSFile } from "@/types/ipfs";
import { IDValue } from "@/types/generic";
import { FT, FTMeta } from "@/types/ft";
import { WFInstance, WFTemplate } from "./workflow";

// VOTE LEVEL
export enum DAOVoteType {
  Democratic, TokenWeighted
}

export type DAOVoteDuration = {
  days: number;
  hours: number;
  minutes: number;
}

export type DAOVoteLevel = {
  type: DAOVoteType;
  quorum: number;
  approveThreshold: number;
  spamThreshold?: number;
  duration: DAOVoteDuration;
  voteOnlyOnce: boolean;
}

// RIGHTS
/*
"Anyone",
"Member",
"TokenHolder,
{"Account": "string"},
{"Group": integer},
{"GroupMember": [integer, string]},
{"GroupLeader": integer},
{"GroupRole": [integer, integer]},

*/
export enum DAORightsType {
  Anyone, Member, TokenHolder, Account, Group, GroupMember, GroupLeader, GroupRole
}

// export type DAORightsAnyone = DAORightsType.Anyone
export type DAORightsAnyone = {
  type: DAORightsType.Anyone;
}

export type DAORightsMember = {
  type: DAORightsType.Member;
}

export type DAORightsTokenHolder = {
  type: DAORightsType.TokenHolder;
}

export type DAORightsAccount = {
  type: DAORightsType.Account;
  accountId: string;
}

export type DAORightsGroup = {
  type: DAORightsType.Group;
  groupId: number;
}

export type DAORightsGroupMember = {
  type: DAORightsType.GroupMember;
  groupId: number;
  accountId: string;
}

export type DAORightsGroupLeader = {
  type: DAORightsType.GroupLeader;
  groupId: number;
}

export type DAORightsGroupRole = {
  type: DAORightsType.GroupRole;
  groupId: number;
  roleId: number;
}

export type DAORights = DAORightsAnyone | DAORightsMember | DAORightsTokenHolder | DAORightsAccount | DAORightsGroup | DAORightsGroupMember | DAORightsGroupLeader | DAORightsGroupRole;

export enum DAODocsFileType {
  url = 'url',
  plain = 'text/plain', 
  binaryPdf = 'application/pdf', 
  html = 'text/html'
}

export type DAODocsFile = {
  name: string;
  type: DAODocsFileType;
  categoryId: number;
  version: string;
  valid: boolean;
  value: string | IPFSFile;
  tagIds: number[];
}

export type DAODocs = {
  files: DAODocsFile[];
  categories: IDValue[];
  tags: IDValue[];
}

export type DAOGroupMember = {
  accountId: string;
  roles: string[];
}

export type DAOTokenUnlocking = {
  algorithm: string;
  locked: number;
  init: number;
  distributed: number;
  unlocked: number;
  duration: number; 
  releaseEnd: number;
}

export type DAOGroup = {
  id: number;
  name: string;
  leader?: string;
  members: DAOGroupMember[];
  token?: DAOTokenUnlocking;
}

export type DAOToken = {
  meta: FTMeta;
  free: number;
  holded: number;
  owned?: number;
}

export type DAOFt = {
  meta: FTMeta;
  free: number;
  holded: number;
  owned?: number;
}

export type DAOTreasury = {
  token: DAOToken;
  near: number;
  nearStorageLocked: number;
  fts: FT[];
}

export type DAOTokenHolder = {
  accountId: string;
  amount: number;
}

export type DAO = {
  name: string;
  purpose: string;
  wallet: string;
  treasury: DAOTreasury;
  location: string;
  lang: string;
  created: Date;
  register: Record<string, unknown>; // TODO: Rename according by smart contract
  docs: DAODocs;
  voteLevels: DAOVoteLevel[];
  groups: DAOGroup[];
  tags: IDValue[];
  proposals: object[];
  tokenHolders: DAOTokenHolder[];
  templates: WFTemplate[];
  workflows: WFInstance[];
}