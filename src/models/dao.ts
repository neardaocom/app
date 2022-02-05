import { toSearch } from '@/utils/string'
import lodashFind from "lodash/find"
import lodashToInteger from "lodash/toInteger"
import { templatePayout, payoutAtStart, payoutAfterPayNear, payoutFinished } from "@/data/workflow"
import lodashNth from "lodash/nth"
import { DAO, DAODocs, DAOGroup, DAOGroupMember, DAOTokenHolder, DAOVoteLevel, DAOVoteType } from '@/types/dao';
import Decimal from "decimal.js";
import moment from 'moment';
import { IDValue, Translate } from '@/types/generic';
import { yoctoNear } from '@/services/nearService/constants';

export const transTags = (tags: string[], t: any) => tags.map(tag => t('default.' + tag));

export const transform = (list: any[], tags: string[], t: any, n: any) => list.map((item, index) => {
    const trans = {
        id: item[0],
        index: index,
        name: item[1].name,
        description: item[1].description,
        location: item[1].lang,
        ft_name: item[1].ft_name,
        ft_amount: n(item[1].ft_amount),
        tags: item[1].tags.map((tag: any) => t('default.' + lodashNth(tags, lodashToInteger(tag)))),
        search: '',
        amount: null,
    }
    trans.search = [toSearch(trans.id), toSearch(trans.name), toSearch(trans.description), toSearch(trans.ft_name)].concat(trans.tags.map((tag: any) => toSearch(tag))).join('-')
    return trans
});

export const getAccountId = (accountId: string): string => accountId.split('.')[0];

export const getGroupCouncil = (dao: DAO, t: any): DAOGroup | undefined => lodashFind(dao.groups, {name: t('default.council')});

export const getMemberFromGroup = (group: DAOGroup, walletId: string): DAOGroupMember | undefined => lodashFind(group.members, {accountId: walletId});

export const isWalletInCouncil = (dao: DAO, walletId: string, t: any): boolean => {
    const group: DAOGroup | undefined = getGroupCouncil(dao, t)
    return group ? getMemberFromGroup(group, walletId) !== undefined : false
};

export const getRole = (dao: DAO, walletId: string): string => {
    let role: string = 'guest'
    // tokenHolder
    if (dao.treasury.token.owned ?? 0 > 0) {
        role = 'tokenHolder'
    }
    // member
    dao.groups.forEach(group => {
        if (group.members.map(member => member.accountId).includes(walletId)) {
            role = 'member'
        }
    })

    return role
};

export const getMembers = (groups: DAOGroup[], proposals: object[]): string[] => {
    const members: string[] = []

    // search in groups
    groups.forEach((group: DAOGroup) => {
        group.members.forEach((member: DAOGroupMember) => {
            if (members.includes(member.accountId) === false) {
                members.push(member.accountId)
            }
        })
    })

    // search in voters
    proposals.forEach((proposal) => { // get list of voting token holders
        // voters
        Object.keys(proposal[1].Curr.votes).forEach((voter: string) => {
            if (members.includes(voter) === false) {
                members.push(voter)
            }
        })
    })

    return members;
}

export const loadById = async (nearService: any, id: string, walletId?: string): Promise<DAO> => {
    const daoId = getAccountId(id)

    console.log(walletId)

    const data = await Promise.all([
      nearService.getDaoAmount(id),
      nearService.getDaoInfo(daoId),
      nearService.getStatisticsMembers(id),
      nearService.getStatisticsFt(id),
      nearService.getProposals(id, 0, 1000),
      nearService.getDocFiles(id),
      nearService.getDaoConfig(id),
      nearService.getTags(),
      nearService.getVotePolicies(id),
      nearService.getSkywardAuctions(id),
    ]).catch((e) => {
      throw new Error(`DAO[${id}] not loaded: ${e}`);
    });

    console.log(data)

    const ft_council_free = new Decimal(data[3].council_ft_stats.unlocked).minus(data[3].council_ft_stats.distributed).toNumber()
    const ft_public_free = new Decimal(data[3].public_ft_stats.unlocked).minus(data[3].public_ft_stats.distributed).toNumber()

    // groups
    const groups: DAOGroup[] = [{
        id: 1,
        name: 'Council',
        members: data[2].council.map((member: string) => { return { accountId: member, roles: [] }}),
        token: {
            algorithm: (typeof data[3].council_release_model === 'string') ? data[3].council_release_model : Object.keys(data[3].council_release_model)[0],
            locked: data[3].council_ft_stats.total,
            init: data[3].council_ft_stats.init_distribution,
            distributed: data[3].council_ft_stats.distributed,
            unlocked: data[3].council_ft_stats.unlocked,
            duration: data[3].council_release_model.Linear.duration,
            releaseEnd: data[3].council_release_model.Linear.release_end,
        },
    }]

    // token holders
    const members: string[] = getMembers(groups, data[4])

    if (walletId !== undefined && members.includes(walletId) === false) {
        members.push(walletId)
    }
    

    const tokenHolders: DAOTokenHolder[] = []
    let walletToken: number | undefined = undefined
    //console.log(member_promises)
    const balances = await Promise.all(
        members.map((member) => nearService.getFtBalanceOf(id, member))
    ).catch((e) => {
        throw new Error(`DAO[${id}] balances not loaded: ${e}`);
    });

    members.forEach((accountId: string, index: number) => {
        tokenHolders.push({accountId: accountId, amount: new Decimal(balances[index] ?? 0).toNumber()})
        if (accountId == walletId) {
            walletToken = new Decimal(balances[index] ?? 0).toNumber()
        }
    });

    // DOCs
    const docs: DAODocs = {
        files: [],
        categories: data[5].map["Doc"].categories.map((item, index) => { return {id: index, value: item}}),
        tags: [],
    }
    data[5].files.forEach((element: any[]) => {
      docs.files.push({
        name: element[1].Curr.name,
        type: element[1].Curr.ext,
        categoryId: element[1].Curr.category,
        version: element[1].Curr.v,
        valid: element[1].Curr.valid,
        value: {
            source: 'web3.storage',
            cid: element[0],
        },
        tagIds: [],
      })
    });

    // vote level
    const firstRight = data[8][0][1];
    const voteLevel: DAOVoteLevel = {
        type: DAOVoteType.TokenWeighted,
        quorum: firstRight.quorum,
        approveThreshold: firstRight.approve_threshold,
        duration: {
            days: moment.duration(firstRight.duration).hours(),
            hours: moment.duration(firstRight.duration).minutes(),
            minutes: moment.duration(firstRight.duration).minutes(),
        }
    }

    // tags
    const tags: IDValue[] = data[1].tags.map((tag: number) => { return { id: tag, value: data[7][tag] }})

    return {
        name: data[1].name,
        purpose: data[1].description,
        wallet: id,
        treasury: {
            token: {
                meta: {
                    name: data[1].ft_name,
                    short: data[1].ft_name,
                    accountId: id,
                    amount: data[1].ft_amount,
                    decimals: data[3].decimals,
                },
                free: new Decimal(ft_council_free).plus(ft_public_free).toNumber(),
                holded: data[3].total_distributed,
                owned: walletToken,
            },
            near: new Decimal(data[0]).toNumber(),
            nearStorageLocked: new Decimal(data[3].storage_locked_near).div(yoctoNear).mul(100).round().div(100).toNumber(),
            fts: [],
        },
        location: '',
        lang: data[6].lang,
        created: new Date(new Decimal(data[1].founded_s).mul(1000).toNumber()),
        register: {
            skywardFinance: data[9] ?? undefined,
        },
        docs: docs,
        voteLevels: [
            voteLevel
        ],
        groups: groups,
        tags: tags,
        proposals: data[4],
        tokenHolders: tokenHolders,
        templates: [templatePayout],
        workflows: [payoutAtStart, payoutAfterPayNear, payoutFinished],
    }
}

export const voteLevelToTranslate = (voteLevel: DAOVoteLevel): Translate => {
    const trans: Translate = {key: '', params: {quorum: voteLevel.quorum, approveThreshold: voteLevel.approveThreshold}}

    switch (voteLevel.type) {
        case DAOVoteType.Democratic:
            trans.key = 'vote_level_democratic'
            break;
        case DAOVoteType.TokenWeighted:
            trans.key = 'vote_level_token_weighted'
            break;
        default:
            throw new Error("Unsupported type: " + voteLevel);
    }
    return trans
}