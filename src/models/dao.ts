import StringHelper from '@/models/utils/StringHelper'
import lodashFind from "lodash/find"
import loToString from "lodash/toString"
import loIsBoolean from "lodash/isBoolean"
import loToInteger from "lodash/toInteger"
import loSnakeCase from "lodash/snakeCase"
import loNth from "lodash/nth"
import loFind from "lodash/find"
import loFindKey from "lodash/findKey"
import loGet from "lodash/get"
import loUniq from "lodash/uniq"
import loUniqWith from "lodash/uniqWith"
import loIsEqual from "lodash/isEqual"
import loValues from "lodash/values"
import { templateMetas, actionMetas } from "@/data/workflow"
import { DAO, DAODocs, DAODocsFile, DAODocsFileType, DAOGroup, DAOGroupMember, DAOTokenHolder, DAOVoteLevel, DAOVoteType, DAOProposal } from '@/models/dao/types/dao';
import Decimal from "decimal.js";
import moment from 'moment';
import { CodeValue, IDValue, Translate } from '@/models/utils/types/generics';
import { WFAction, WFActionCall, WFActionFunctionCall, WFActivity, WFInstance, WFInstanceLog, WFMetaTemplate, WFSettings, WFSettingsAction, WFTemplate, WFTransition } from '@/models/dao/types/workflow'
import Rights from "@/models/dao/Rights";
import { keys } from 'lodash'
import near from '@/store/modules/near'
import NearUtils from "@/models/nearBlockchain/Utils"
import { basicStaking } from '../../tests/fixtures/staking'
import GroupHelper from './dao/GroupHelper'

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
    trans.search = [StringHelper.toSearch(trans.id), StringHelper.toSearch(trans.name), StringHelper.toSearch(trans.description), StringHelper.toSearch(trans.ft_name)].concat(trans.tags.map((tag: any) => StringHelper.toSearch(tag))).join('-')
    return trans
})

export const getAccountId = (accountId: string): string => accountId.split('.')[0];



export const getMemberFromGroup = (group: DAOGroup, walletId: string): DAOGroupMember | undefined => lodashFind(group.members, {accountId: walletId});

export const isWalletInCouncil = (dao: DAO, walletId: string, t: any): boolean => {
    const group: DAOGroup | undefined = GroupHelper.getGroupCouncil(dao, t)
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

export const transVoteLevels = (templatesFromChain: any[]): DAOVoteLevel[] => {
    const voteLevels: DAOVoteLevel[] = []
    templatesFromChain.forEach((template) => {
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
    return voteLevels
}

export const transTemplates = (templatesFromChain: any[], t: Function): WFTemplate[] => {
    const templates: WFTemplate[] = []
    let action: WFAction
    let activity: WFActivity | undefined
    let templateMeta: WFMetaTemplate | undefined
/*
    // console.log("Template", dataHack[0])
    templatesFromChain.forEach((template) => {
        // console.log(template)

        // action and activity
        const activities: WFActivity[] = []
        const actions: WFAction[] = []
        const startActionIds: number[] = []
        const endActionIds: number[] = []

        // load meta
        templateMeta = loGet(templateMetas, [template[1][0].name])

        template[1][0].activities.forEach((actionChain, index) => {
            if (actionChain !== null) {
                // console.log('action from chain', actionChain)
                // set activity
                activity = loFind(activities, {code: actionChain.code})
                if (activity === undefined) {
                    activity = {
                        id: activities.length,
                        code: actionChain.code,
                        actionIds: [index - 1],
                        attributes: [],
                    }
                    activities.push(activity)
                } else {
                    activity.actionIds.push(index - 1)
                }

                // console.log('templateMeta', templateMeta?.actions)

                // create action
                if (actionChain.action !== 'FnCall') { // actionCall
                    action = {
                        id: index - 1,
                        activityId: activity.id,
                        gas: templateMeta?.actions[index - 1]?.gas ?? NearUtils.gasDefault,
                        deposit: templateMeta?.actions[index - 1]?.deposit ?? NearUtils.depositDefault,
                        method: loSnakeCase(actionChain.action),
                    }
                } else { // functionCall
                    action = {
                        id: index - 1,
                        activityId: activity.id,
                        gas: templateMeta?.actions[index - 1]?.gas ?? NearUtils.gasDefault,
                        deposit: templateMeta?.actions[index - 1]?.deposit ?? NearUtils.gasDefault,
                        fncallReceiver: actionChain.action_data.FnCall.id[0],
                        fncallMethod: actionChain.action_data.FnCall.id[1],
                        fncallGas: actionChain.action_data.FnCall.tgas,
                        fncallDeposit: actionChain.action_data.FnCall.deposit,
                    }
                }
                actions.push(action)

                // add end
                if (template[1][0].end.includes(index)) {
                    endActionIds.push(action.id)
                }
            }
        })

        // transitions
        const transitions: WFTransition[] = []
        template[1][0].transitions.forEach((transactionChainToIds, index) => {
            if (index === 0) {
                transactionChainToIds.forEach((toId) => startActionIds.push(toId - 1))
            } else {
                transitions.push({ id: index - 1, toIds: transactionChainToIds.map((toId) => toId - 1) })
            }
        })        

        // settings
        const settings: WFSettings[] = []
        template[1][1].forEach((settingsItem, index) => {
            const settingsActions: WFSettingsAction[] = []
            // action rights
            settingsItem.activity_rights.forEach((rightsChain, index) => {
                settingsActions.push({
                    actionId: index,
                    rights: rightsChain.map((rightChain) => Rights.parse(rightChain))
                })
            })
            // settings
            settings.push({
                id: index,
                constants: [],
                proposeRights: settingsItem.allowed_proposers.map(item => Rights.parse(item)),
                voteRight: Rights.parse(settingsItem.allowed_voters),
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
                actionRights: settingsActions,
            })
        })
        
        templates.push({
            id: loToInteger(template[0]),
            version: loToString(template[1][0].version),
            code: template[1][0].name,
            //constants: [],
            //attributes: [],
            activities: activities,
            transactions: transitions,
            startActiIds: loUniq(startActionIds),
            endActionIds: loUniq(endActionIds),
            search: [StringHelper.toSearch(t('default.wf_templ_' + template[1][0].name))].join('-'),
            settings: settings,
        })
    });
*/

    return templates;
}

export const loadById = async (nearService: any, id: string, t: Function, walletId?: string): Promise<any> => {
    const daoId = getAccountId(id)

    // console.log(walletId)
    /*
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
    */

    const dataHack = await Promise.all([
      nearService.getWfTemplates(id),
      nearService.getGroups(id),
      nearService.getGroupTags(id),
      nearService.getMediaTags(id),
      nearService.getMediaList(id),
      nearService.getGlobalTags(id),
      nearService.getProposals(id, 0, 1000),
      nearService.getDaoSettings(id),
      nearService.getStats(id),
      nearService.getFtMetadata(id),
      nearService.getDaoAmount(id),
      nearService.getStorage(id),
    ]).catch((e) => {
      throw new Error(`DAOHack[${id}] not loaded: ${e}`);
    });

    // console.log(data, dataHack)
    // console.log(dataHack)

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

    const ft_treasury_holded = new Decimal(dataHack[8].ft_total_distributed).toNumber()
    const ft_treasury_free = new Decimal(dataHack[8].ft_total_supply).minus(dataHack[8].ft_total_locked).toNumber()

    // token holders 
        // TODO: Is it good way to find members, form proposals??

    //const members: string[] = getMembers(groups, data[4])
    const members: string[] = getMembers(groups, dataHack[6])

    //if (walletId !== undefined && members.includes(walletId) === false) {
    //    members.push(walletId)
    //}
    
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
    // console.log(docs);
    

    dataHack[4].forEach((element) => {
        console.log();
        
        const mediaTypeKey = Object.keys(element.media_type)[0]
        const value = mediaTypeKey === 'Link' || mediaTypeKey === 'Text' ? 
            element.media_type[mediaTypeKey] : 
            { source: element.media_type[mediaTypeKey].ipfs, cid: element.media_type[mediaTypeKey].cid }

        let type = DAODocsFileType.plain
        switch (mediaTypeKey) {
            case 'Link':
                type = DAODocsFileType.url
                break
            case 'Text':
                type = DAODocsFileType.plain
                break
            default:
                type = DAODocsFileType[loFindKey(DAODocsFileType, value => value === element.media_type[mediaTypeKey].mimetype ) || ''];
            }  
            

        docs.files.push({
          name: element.name,
          type: type,
          categoryId: loFind(docs.categories, { value: element.category })?.id ?? -1,
          category: element.category,
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

    const voteLevels: DAOVoteLevel[] = transVoteLevels(dataHack[0])

    // tags
    //const tags: IDValue[] = data[1].tags.map((tag: number) => { return { id: tag, value: data[7][tag] }})
    const tags: IDValue[] = getTags(dataHack[5].map, dataHack[7].tags)

//    console.log(tags);
   

    // templates
    const templates: WFTemplate[] = transTemplates(dataHack[0], t)
    let templateMeta: WFMetaTemplate | undefined
    // console.log('Templates', templates)

    // Proposals
    const proposals: DAOProposal[] = []
    const workflows: WFInstance[] = []

    let workflowInstance: any
    let workflowLog: any
    let proposalTemplate: WFTemplate | undefined
    let proposalSettings: WFSettings | undefined
    let proposalConstants: CodeValue[]
    let proposalInputs: CodeValue[]
    let actionLogs: WFInstanceLog[]

    for (const proposal of dataHack[6]) {
        actionLogs = []
        // console.log(proposal)
        workflowInstance = await nearService.getWfInstance(id, proposal[0])
        proposalTemplate = loFind(templates, {id: proposal[1].Curr.workflow_id})
        proposalSettings = loFind(proposalTemplate?.settings, {id: proposal[1].Curr.workflow_settings_id})
        templateMeta = loGet(templateMetas, [proposalTemplate!.code])
        // console.log("WorkflowInstance", workflowInstance, proposalTemplate, proposalSettings)

        proposalConstants = []
        //proposalConstants = templateMeta?.constants.map((attr) => {
        //    return { code: attr.code, value: loGet(proposalSettings?.constants, [attr.bindId])?.value}
        //}) ?? []

        proposalInputs = templateMeta?.inputs.map((attr) => {
            // console.log('Binds', Object.values(workflowInstance[1].binds[attr.bindId]))
            return { code: attr.code, value: loValues(workflowInstance[1].binds[attr.bindId])[0]}
        }) ?? []

        // load action logs
        if (workflowInstance[0].state !== 'Waiting') {
            workflowLog = await nearService.getWfInstanceLog(id, proposal[0])
            workflowLog?.forEach((log, index) => {
                //console.log('Log', log)
                actionLogs.push({
                    id: index,
                    activityId: log.action_id - 1,
                    txSigner: log.caller,
                    txSignedAt: NearUtils.dateFromChain(log.timestamp),
                    args: templateMeta?.actions[log.action_id - 1]?.log(log.args),
                })
            })
        }

        proposals.push({
            id: proposal[0],
            created: NearUtils.dateFromChain(proposal[1].Curr.created),
            createdBy: proposal[1].Curr.created_by,
            votes: proposal[1].Curr.votes,
            state: proposal[1].Curr.state,
            templateId: proposal[1].Curr.workflow_id,
            settingsId: proposal[1].Curr.workflow_settings_id,
            workflowScenarioId: 1,
            workflowAddSettingsId: proposal[1].Curr.workflow_add_settings_id,
            inputs: proposalInputs,
            constants: proposalConstants,
            content: proposal[1].Curr.content ?? {},
        })

        workflows.push({
            id: proposal[0],
            templateId: proposal[1].Curr.workflow_id,
            settingsId: proposal[1].Curr.workflow_settings_id,
            workflowScenarioId: 1,
            state: workflowInstance[0].state,
            storage: workflowInstance[1].storage_key,
            inputs: proposalInputs,
            constants: proposalConstants,
            activityLastId: (workflowInstance[0].current_activity_id === 0) ? 0 : (workflowInstance[0].current_activity_id - 1),
            activityLogs: actionLogs,
            search: [StringHelper.toSearch('#' + proposal[0]), proposalTemplate?.search ?? ''].join('-'),
        })
    }
    // console.log(proposals, workflows)


    return {
        name: dataHack[7].name,
        purpose: dataHack[7].purpose,
        wallet: id,
        treasury: {
            token: {
                meta: {
                    name: dataHack[9].name,
                    short: dataHack[9].symbol, // TODO: short -> symbol
                    accountId: id,
                    amount: dataHack[8].ft_total_supply,
                    decimals: dataHack[9].decimals,
                },
                free: ft_treasury_free,
                holded: ft_treasury_holded,
                owned: walletToken,
            },
            near: new Decimal(dataHack[10]).toNumber(),
            nearStorageLocked: 6.7, // TODO: Add storage locked
            fts: [],
        },
        location: '',
        lang: '', // TODO: Add lang to DAO
        created: new Date(), // TODO: DAO created
        version: '1.0',
        storage: dataHack[11],
        docs: docs,
        voteLevels: voteLevels,
        groups: groups,
        tags: tags,
        proposals: proposals,
        tokenHolders: tokenHolders,
        templates: templates,
        workflows: workflows,
        treasuryLocks: [],
        staking: basicStaking(),
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