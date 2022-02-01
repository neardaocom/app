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
};

export type DAORightEveryone = {
  type: DAORightType.Everyone;
};

export type DAORightMember = {
  type: DAORightType.Member;
};

export type DAORightTokenHolder = {
  type: DAORightType.TokenHolder;
};

export type DAORightGroup = {
  type: DAORightType.Group;
  groupId: number;
};

export type DAORightGroupLeader = {
  type: DAORightType.GroupLeader;
  groupId: number;
};

export type DAORightGroupRole = {
  type: DAORightType.GroupRole;
  groupId: number;
  roleId: number;
};

export type DAORight = DAORightEveryone | DAORightMember | DAORightTokenHolder | DAORightGroup | DAORightGroupLeader | DAORightGroupRole;