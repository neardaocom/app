import { IPFSFile } from "@/types/ipfs";
import { CodeValue, IDValue, Interval } from "@/models/utils/types/generics";
import { FT, FTMeta } from "@/types/ft";
import { WFInstance, WFTemplate } from "./workflow";
import { TreasuryLock } from "./treasury";
import { Staking } from "./staking";
import { Settings } from "@/models/nearBlockchain/types/dao";
import { RewardPricelist } from "./rewards";
import { Media, ResourceType, ResourceTypeCid } from "@/models/nearBlockchain/types/resource";
import { DAODocs } from "./docs";

// VOTE LEVEL
export enum DAOVoteType {
  Democratic = 'democratic',
  TokenWeighted = 'token_weighted',
}

export type DAOVoteLevel = {
  type: DAOVoteType;
  quorum: number;
  approveThreshold: number;
  spamThreshold?: number;
  duration: Interval;
  voteOnlyOnce: boolean;
}

export type DAOVote = {
  accountId: string;
  vote: number;
}

// RIGHTS
export enum DAORightsType {
  Anyone = 'anyone',
  Member = 'member',
  TokenHolder = 'token_holder',
  Account = 'account',
  Group = 'group',
  GroupMember = 'group_member',
  GroupLeader = 'group_leader',
  GroupRole = 'group_role',
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
  parentId: number;
}

export type DAOToken = {
  meta: FTMeta;
  free: number;
  holded: number;
  owned?: number | string;
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

export type DAOMember = {
  accountId: string;
  voteAmount: number;
}

export type DAOVotingResults = {
  amount: number;
  yes: number;
  no: number;
}

export type DAOProposal = {
  id: number;
  created: Date;
  createdBy: string;
  end?: Date; // TODO: Move to required
  description?: Media | null;
  votes: DAOVote[];
  votingResults?: DAOVotingResults;
  state: string;
  templateId: number;
  settingsId: number;
  workflowScenarioId: number | null;
  inputs: CodeValue[];
  storageKey?: string | null;
  constants: CodeValue[];
  workflow?: WFInstance;
  content?: Record<string, unknown>; // Deprecated?
  workflowAddSettingsId?: number; // Deprecated?
}


export type DAO = {
  name: string;
  purpose: string;
  wallet: string;
  treasury: DAOTreasury;
  location: string;
  lang: string;
  created: Date | undefined;
  version: string;
  storage: Record<string, unknown>; // TODO: Rename according by smart contract
  docs: DAODocs;
  voteLevels: DAOVoteLevel[];
  groups: DAOGroup[];
  tags: IDValue[];
  members: DAOMember[];
  templates: Record<number, WFTemplate>;
  proposals: DAOProposal[];
  treasuryLocks: TreasuryLock[];
  staking: Staking;
  settings: Settings;
  statistics: Record<string, unknown>;
  rewardsPricelists: RewardPricelist[];
}

export type DAODTO = {
  id: number;
  code: string;
  title: string;
  description: string;
  typeIndex: number;
  type: string;
  stateIndex: number;
  state: string;
  status: string;
  canVote: boolean;
  isOver: boolean;
  isVoted: boolean;
  args: Record<string, unknown>;
  votingStats: Record<string, unknown>[];
  duration: Record<string, unknown>;
  config: Record<string, unknown>;
  choiceIndex: number;
  choice: string;
  progress: number;
  quorum: number;
  search: string;
}
