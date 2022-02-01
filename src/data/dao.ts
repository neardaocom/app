import { DAORight, DAORightType, DAOVoteLevel, DAOVoteType } from "@/types/dao";
// voting
export const votingDemocraticHalfOneHour: DAOVoteLevel = { type: DAOVoteType.Democratic, quorum: 0.5, approveThreshold: 0.5, duration: { days: 0, hours: 1, minutes: 0 } }
export const votingTokenWeightedLow: DAOVoteLevel = { type: DAOVoteType.TokenWeighted, quorum: 0.2, approveThreshold: 0.3, duration: { days: 0, hours: 1, minutes: 0 } }
export const votingTokenWeightedHigh: DAOVoteLevel = { type: DAOVoteType.TokenWeighted, quorum: 0.2, approveThreshold: 0.8, duration: { days: 0, hours: 1, minutes: 0 } }
// rights
export const rightEveryone: DAORight = {type: DAORightType.Everyone};
export const rightMember: DAORight = {type: DAORightType.Member};
export const rightTokenHolder: DAORight = {type: DAORightType.TokenHolder};
export const rightTokenGroupCouncil: DAORight = {type: DAORightType.Group, groupId: 1};
export const rightTokenGroupCouncilLeader: DAORight = {type: DAORightType.GroupLeader, groupId: 1};
export const rightTokenGroupCouncilRole: DAORight = {type: DAORightType.GroupRole, groupId: 1, roleId: 1};