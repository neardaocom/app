import { DAO, DAORights, DAORightsType, DAOVoteLevel, DAOVoteType } from "@/types/dao";
// voting
export const votingDemocraticHalfOneHour: DAOVoteLevel = { type: DAOVoteType.Democratic, quorum: 50, approveThreshold: 50, duration: { days: 0, hours: 1, minutes: 0 }, voteOnlyOnce: true }
export const votingTokenWeightedLow: DAOVoteLevel = { type: DAOVoteType.TokenWeighted, quorum: 20, approveThreshold: 30, duration: { days: 0, hours: 1, minutes: 0 }, voteOnlyOnce: true }
export const votingTokenWeightedHigh: DAOVoteLevel = { type: DAOVoteType.TokenWeighted, quorum: 20, approveThreshold: 80, duration: { days: 0, hours: 1, minutes: 0 }, voteOnlyOnce: true }
// rights
export const rightAnyone: DAORights = {type: DAORightsType.Anyone};
export const rightMember: DAORights = {type: DAORightsType.Member};
export const rightTokenHolder: DAORights = {type: DAORightsType.TokenHolder};
export const rightTokenGroupCouncil: DAORights = {type: DAORightsType.Group, groupId: 1};
export const rightTokenGroupCouncilLeader: DAORights = {type: DAORightsType.GroupLeader, groupId: 1};
export const rightTokenGroupCouncilRole: DAORights = {type: DAORightsType.GroupRole, groupId: 1, roleId: 1};

export const daoTestOne: DAO = {
    name: 'DAO',
    purpose: 'Testing',
    wallet: 'dao.testnet',
    treasury: {
        token: {
            meta: {
                name: 'dao',
                short: 'DAO',
                accountId: 'dao.testnet',
                amount: 1_000_000,
                decimals: 0,
            },
            free: 800_000,
            holded: 200_000,
            owned: 50_000,
        },
        near: 5.5,
        nearStorageLocked: 4.3,
        fts: [],
    },
    location: 'glo',
    lang: 'en',
    created: new Date(),
    register: {

    },
    docs: {
        files: [],
        categories: [],
        tags: [],
    },
    voteLevels: [],
    groups: [
        {
            id: 1,
            name: 'Council',
            leader: 'account.testnet',
            members: [
                { accountId: 'account.testnet', roles: ['role'] }
            ],
        },
    ],
    tags: [],
    proposals: [],
    tokenHolders: [
        { accountId: 'token-holder.testnet', amount: 0 },
    ],
    templates: [],
    workflows: [],
}