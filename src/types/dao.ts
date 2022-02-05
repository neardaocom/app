import { IPFSFile } from "@/types/ipfs";
import { IDValue } from "@/types/generic";
import { FT, FTMeta } from "@/types/ft";

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
}

// RIGHTS
export enum DAORightType {
  Everyone, Member, TokenHolder, Group, GroupLeader, GroupRole
}

export type DAORightEveryone = {
  type: DAORightType.Everyone;
}

export type DAORightMember = {
  type: DAORightType.Member;
}

export type DAORightTokenHolder = {
  type: DAORightType.TokenHolder;
}

export type DAORightGroup = {
  type: DAORightType.Group;
  groupId: number;
}

export type DAORightGroupLeader = {
  type: DAORightType.GroupLeader;
  groupId: number;
}

export type DAORightGroupRole = {
  type: DAORightType.GroupRole;
  groupId: number;
  roleId: number;
}

export type DAORight = DAORightEveryone | DAORightMember | DAORightTokenHolder | DAORightGroup | DAORightGroupLeader | DAORightGroupRole;

export enum DAODocsFileType {
  url, plain, binaryPdf, html
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
  register: object; // TODO: Rename to
  docs: DAODocs;
  voteLevels: DAOVoteLevel[];
  groups: DAOGroup[];
  tags: IDValue[];
  proposals: object[];
  tokenHolders: object[];
}