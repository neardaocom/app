import { toSearch } from '@/utils/string'
import lodashFind from "lodash/find"
import loToString from "lodash/toString"
import loIsBoolean from "lodash/isBoolean"
import loToInteger from "lodash/toInteger"
import loNth from "lodash/nth"
import loFind from "lodash/find"
import loFindKey from "lodash/findKey"
import loUniq from "lodash/uniq"
import loUniqWith from "lodash/uniqWith"
import loIsEqual from "lodash/isEqual"
import { templatePayout, payoutAtStart, payoutAfterPayNear, payoutFinished } from "@/data/workflow"
import { DAO, DAODocs, DAODocsFile, DAODocsFileType, DAOGroup, DAOGroupMember, DAOTokenHolder, DAOVoteLevel, DAOVoteType } from '@/types/dao';
import Decimal from "decimal.js";
import moment from 'moment';
import { IDValue, Translate } from '@/types/generic';
import { yoctoNear } from '@/services/nearService/constants';
import { WFAction, WFActivity, WFInstance, WFSettings, WFSettingsActivity, WFTemplate, WFTransition } from '@/types/workflow'
import { parse as rightsParse } from "@/models/rights";
import { keys } from 'lodash'

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
        tags: item[1].tags.map((tag: any) => t('default.' + loNth(tags, loToInteger(tag)))),
        search: '',
        amount: null,
    }
    trans.search = [toSearch(trans.id), toSearch(trans.name), toSearch(trans.description), toSearch(trans.ft_name)].concat(trans.tags.map((tag: any) => toSearch(tag))).join('-')
    return trans
})

export const getDaoActionMethod = (name: string): string => {
    let methodName: string = ''
    switch (name) {
        case "GroupAdd":
            methodName = 'group_add'
            break;
        case "GroupRemove":
            methodName = 'group_remove'
            break;
        case "GroupUpdate":
            methodName = 'group_update'
            break;
        case "GroupMemberAdd":
            methodName = 'group_member_add'
            break;
        case "GroupMemberRemove":
            methodName = 'group_member_remove'
            break;
        case "SettingsUpdate":
            methodName = 'settings_update'
            break;
        case "MediaAdd":
            methodName = 'media_add'
            break;
        case "MediaInvalidate":
            methodName = 'media_invalidate'
            break;
        case "FnCall":
            methodName = 'function_call'
            break;
        case "FnCallAdd":
            methodName = 'function_call_add'
            break;
        case "FnCallRemove":
            methodName = 'function_call_remove'
            break;
        case "TagAdd":
            methodName = 'tag_add'
            break;
        case "TagEdit":
            methodName = 'tag_edit'
            break;
        case "TagRemove":
            methodName = 'tag_remove'
            break;
        case "FtDistribute":
            methodName = 'ft_distribute'
            break;
        case "FtSend":
            methodName = 'treasury_ft_send'
            break;
        case "NftSend":
            methodName = 'treasury_nft_send'
            break;
        case "NearSend":
            methodName = 'treasury_near_send'
            break;
        case "WorkflowAdd":
            methodName = 'workflow_add'
            break;
        default:
            throw new Error("Unsupported name: " + name)
    }
    return methodName
}

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

export const getMediaCategories = (docFiles: any[]) => {
    const categories: IDValue[] = []
    let i = 0
    docFiles.forEach((item) => { 
        const bool = categories.some(category => category.value === item.category)
        if(bool === false){
            categories.push({
                id: i,
                value: item.category
            })
            i++
        }
    })
    return categories
}


export const getTagsObjects = (tagsObj: object, keys: number[] ) =>{
    const tags: IDValue[] = []
    Object.keys(tagsObj).forEach((key) => {
        if(keys.includes(+key)){
            tags.push({
                id: +key,
                value: tagsObj[key.toString()]
            })
        } 
    })
    return tags
}

export const getTags = (globalTags: object, validTags: number[] | boolean = false ) => {
    let keys
    if(validTags === false){
        keys = Object.keys(globalTags).map((el) => +el);
    }else{
        keys = validTags
    }    
    return getTagsObjects(globalTags, keys)
}

export const loadById = async (nearService: any, id: string, t: any, walletId?: string): Promise<DAO> => {
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

    const dataHack = await Promise.all([
      nearService.getWfTemplates(),
      nearService.getGroups(),
      nearService.getGroupTags(),
      nearService.getMediaTags(),
      nearService.getMediaList(),
      nearService.getGlobalTags(),
      nearService.getHackProposals(id,0, 1000),
      nearService.getDaoSettings()
    ]).catch((e) => {
      throw new Error(`DAOHack[${id}] not loaded: ${e}`);
    });

    console.log(data, dataHack)

    const ft_council_free = new Decimal(data[3].council_ft_stats.unlocked).minus(data[3].council_ft_stats.distributed).toNumber()
    const ft_public_free = new Decimal(data[3].public_ft_stats.unlocked).minus(data[3].public_ft_stats.distributed).toNumber()

     // groups

    // const groups: DAOGroup[] = [{
    //     id: 1,
    //     name: 'Council',
    //     members: data[2].council.map((member: string) => { return { accountId: member, roles: [] }}),
    //     token: {
    //         algorithm: (typeof data[3].council_release_model === 'string') ? data[3].council_release_model : Object.keys(data[3].council_release_model)[0],
    //         locked: data[3].council_ft_stats.total,
    //         init: data[3].council_ft_stats.init_distribution,
    //         distributed: data[3].council_ft_stats.distributed,
    //         unlocked: data[3].council_ft_stats.unlocked,
    //         duration: data[3].council_release_model.Linear.duration,
    //         releaseEnd: data[3].council_release_model.Linear.release_end,
    //     },
    // }]

    const groupTags = dataHack[2]
    const groups: DAOGroup[] = dataHack[1].map(group => {
        const members = group.members.map(member => {
            return{
                accountId: member.account_id, 
                roles: member.tags.map(tag => groupTags.map[tag])
            }
        } )
        let token
        if (group.release_data && group.release_model){
            const algorithm: string = Object.keys(group.release_model)[0]
            token = {
                algorithm: algorithm,
                locked: group.release_data.total,
                init: group.release_data.init_distribution,
                distributed: group.release_data.init_distribution,
                unlocked: group.release_data.unlocked,
                duration: group.release_model[algorithm].duration,
                releaseEnd: group.release_model[algorithm].release_end,
            }
        }
        return {
            id: group.id,
            name: group.settings.name,
            leader: group.settings.leader || undefined,
            members,
            token: token || undefined
        }        
    });
        

    // token holders 
        // TODO: Is it good way to find members, form proposals??

    //const members: string[] = getMembers(groups, data[4])
    const members: string[] = getMembers(groups, dataHack[6])

    if (walletId !== undefined && members.includes(walletId) === false) {
        members.push(walletId)
    }
    
    const tokenHolders: DAOTokenHolder[] = []
    let walletToken: number | undefined = undefined
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

    // const docs: DAODocs = {
    //     files: [],
    //     categories: data[5].map["Doc"].categories.map((item, index) => { return {id: index, value: item}}),
    //     tags: [],
    // }
    // data[5].files.forEach((element: any[]) => {
    //   docs.files.push({
    //     name: element[1].Curr.name,
    //     type: element[1].Curr.ext,
    //     categoryId: element[1].Curr.category,
    //     version: element[1].Curr.v,
    //     valid: element[1].Curr.valid,
    //     value: {
    //         source: 'web3.storage',
    //         cid: element[0],
    //     },
    //     tagIds: [],
    //   })
    // });
    
    const docs: DAODocs = {
        files: [],
        categories: getMediaCategories(dataHack[4]),
        tags: getTags(dataHack[3].map),
    }
    console.log(docs);
    

    dataHack[4].forEach((element) => {
        const mediaTypeKey = Object.keys(element.media_type)[0]
        const value = mediaTypeKey === 'Link' ? 
            element.media_type[mediaTypeKey] : 
            { source: element.media_type[mediaTypeKey].ipfs, cid: element.media_type[mediaTypeKey].cid }
        const type = mediaTypeKey === 'Link' ?
            DAODocsFileType.url :
            DAODocsFileType[loFindKey(DAODocsFileType, value => value === element.media_type[mediaTypeKey].mimetype ) || '']            

        docs.files.push({
          name: element.name,
          type: type,
          categoryId: loFind(docs.categories, { value: element.category })?.id || -1,
          version: element.version,
          valid: element.valid,
          value: value,
          tagIds: element.tags,
        })
      });



    // vote level

    // const firstRight = data[8][0][1];
    // const durationDay = moment.duration(firstRight.duration).hours()
    // const durationHours = moment.duration(firstRight.duration).minutes()
    // const durationMinutes = moment.duration(firstRight.duration).minutes()
    // const voteLevel: DAOVoteLevel = {
    //     type: DAOVoteType.TokenWeighted,
    //     quorum: firstRight.quorum,
    //     approveThreshold: firstRight.approve_threshold,
    //     duration: {
    //         days: moment().startOf('year').add(durationDay).hours(),
    //         hours: moment().startOf('year').add(durationHours).minutes(),
    //         minutes: moment().startOf('year').add(durationMinutes).minutes(),
    //     },
    //     voteOnlyOnce: true,
    // }

    const voteLevels: DAOVoteLevel[] = []
    dataHack[0].forEach((template) => {
        template[1][1].forEach((settingsItem) => {
            voteLevels.push({
                type: (settingsItem.scenario === 'TokenWeighted') ? DAOVoteType.TokenWeighted : DAOVoteType.Democratic,
                quorum: settingsItem.quorum,
                approveThreshold: settingsItem.approve_threshold,
                spamThreshold: settingsItem.spam_threshold,
                duration: {
                    days: moment.duration(settingsItem.duration * 1000).days(),
                    hours: moment.duration(settingsItem.duration * 1000).hours(),
                    minutes: moment.duration(settingsItem.duration * 1000).minutes()
                  },
                voteOnlyOnce: loIsBoolean(settingsItem.vote_only_once) ? settingsItem.vote_only_once : true,
            })
        })
    })
    loUniqWith(voteLevels, loIsEqual)
    

    // tags
    //const tags: IDValue[] = data[1].tags.map((tag: number) => { return { id: tag, value: data[7][tag] }})
    const tags: IDValue[] = getTags(dataHack[5].map, dataHack[7].tags)

   console.log(tags);
   

    // templates
    const templates: WFTemplate[] = []
    let action: WFAction = {id: 0, name: '', code: '', smartContractMethod: ''}
    let activity: WFActivity | undefined = undefined
    // console.log(dataHack[0])
    dataHack[0].forEach((template) => {
        console.log(template)

        // activities
        const activities: WFActivity[] = []
        const startActivityIds: number[] = []
        const endActivityIds: number[] = []
        template[1][0].activities.forEach((actionTempl, index) => {
            if (actionTempl !== null) {
                action = {
                    id: index,
                    name: t('default.wf_templ_' + template[1][0].name + '_action_' + actionTempl.action),
                    code: actionTempl.action,
                    smartContractMethod: getDaoActionMethod(actionTempl.action),
                }
                activity = loFind(activities, {code: action.code})
                if (activity !== undefined) {
                    activity.actions.push(action)
                } else {
                    activity = {
                        id: index,
                        name: t('default.wf_templ_' + template[1][0].name + '_activity_' + actionTempl.code),
                        code: actionTempl.code,
                        smartContractId: (actionTempl.fncall_id === null) ? '' : loToString(actionTempl.fncall_id),
                        attributes: [],
                        actions: [action]
                    }
                    activities.push(activity)
                }

                // end
                if (template[1][0].end.includes(index)) {
                    endActivityIds.push(activity.id)
                }
            }
        })

        // transitions
        const transitions: WFTransition[] = []
        let activityTarget: WFActivity | undefined;
        let activityTo: WFActivity | undefined;
        template[1][0].transitions.forEach((transToIds, index) => {
            if (transToIds !== null ) {
                if (index === 0) {
                    // start
                    transToIds.forEach((transToId) => {
                        activityTo = loFind(activities, {code: template[1][0].activities[transToId].code})
                        if (activityTo) {
                            startActivityIds.push(activityTo.id)
                        }
                    })
                } else {
                    // transitions
                    activityTarget = loFind(activities, {code: template[1][0].activities[index].code})
                    transToIds.forEach((transToId) => {
                        activityTo = loFind(activities, {code: template[1][0].activities[transToId].code})
                        if (activityTarget && activityTo) {
                            transitions.push({
                                id: index,
                                fromId: activityTarget.id,
                                toId: activityTo.id,
                            })
                        }
                        // start
                        if (index === 0 && activityTo) {
                            startActivityIds.push(activityTo.id)
                        }
                    })
                }
            }
        })

        // settings
        const settings: WFSettings[] = []
        const settingsActivities: WFSettingsActivity[] = []
        let settingsActivitiesItem: WFSettingsActivity | undefined
        template[1][1].forEach((settingsItem, index) => {
            settingsItem.activity_rights.forEach((rightsList, index) => {
                if (index > 0) {
                    activityTarget = loFind(activities, {code: template[1][0].activities[index].code})
                    settingsActivitiesItem = loFind(settingsActivities, {activityId: activityTarget!.id})
                    if (settingsActivitiesItem === undefined) {
                        settingsActivitiesItem = {activityId: activityTarget!.id, rights: []}
                        settingsActivities.push(settingsActivitiesItem)
                    }
                    rightsList.forEach((rights) => {
                        settingsActivitiesItem!.rights.push(rightsParse(rights))
                    })
                    settingsActivitiesItem!.rights = loUniq(settingsActivitiesItem!.rights)
                }
            })
            settings.push({
                id: index + 1,
                constants: [],
                proposeRights: settingsItem.allowed_proposers.map(item => rightsParse(item)),
                voteRight: rightsParse(settingsItem.allowed_voters),
                voteLevel: {
                    type: (settingsItem.scenario === 'TokenWeighted') ? DAOVoteType.TokenWeighted : DAOVoteType.Democratic,
                    quorum: settingsItem.quorum,
                    approveThreshold: settingsItem.approve_threshold,
                    spamThreshold: settingsItem.spam_threshold,
                    duration: {
                        days: moment.duration(settingsItem.duration * 1000).days(),
                        hours: moment.duration(settingsItem.duration * 1000).hours(),
                        minutes: moment.duration(settingsItem.duration * 1000).minutes()
                      },
                    voteOnlyOnce: loIsBoolean(settingsItem.vote_only_once) ? settingsItem.vote_only_once : true,
                },
                activities: settingsActivities,
            })
        })
        
        templates.push({
            id: loToInteger(template[0]),
            name: t('default.wf_templ_' + template[1][0].name),
            version: loToString(template[1][0].version),
            code: template[1][0].name,
            constants: [],
            attributes: [],
            activities: activities,
            transactions: transitions,
            startActivityIds: loUniq(startActivityIds),
            endActivityIds: loUniq(endActivityIds),
            search: [toSearch(t('default.wf_templ_' + template[1][0].name))].join('-'),
            settings: settings,
        })
        
    });

    // workflows TODO: Load from smart contract
    const workflows: WFInstance[] = [payoutAtStart, payoutAfterPayNear, payoutFinished]

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
        voteLevels: voteLevels,
        groups: groups,
        tags: tags,
        proposals: data[4],
        tokenHolders: tokenHolders,
        templates: templates,
        workflows: workflows,
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