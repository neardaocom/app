import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAOVoteType } from "../types/dao";
import moment from 'moment';
import loIsBoolean from "lodash/isBoolean"
import loToString from "lodash/toString"
import loToInteger from "lodash/toInteger"
import loUniq from "lodash/uniq"
import loGet from "lodash/get"
import loFind from "lodash/find"
import loSnakeCase from "lodash/snakeCase"
import { WFAction, WFActivity, WFMetaTemplate, WFTransition, WFSettings, WFSettingsAction} from "../types/workflow";
import { templateMetas } from "../data/workflowMeta"
import Rights from "../Rights";
import StringHelper from '../../utils/StringHelper'
import NearUtils from "@/models/nearBlockchain/Utils";

export default class TemplateTransformer implements TransformerInterface {
    private templateMetas: Record<string, WFMetaTemplate>;
    private t: Function;

    constructor(t: Function) {
        this.templateMetas = templateMetas
        this.t = t
    }

    transform(value: any, params: any) {
        // console.log(template)
        let action: WFAction
        let activity: WFActivity | undefined
        // action and activity
        const activities: WFActivity[] = []
        const actions: WFAction[] = []
        const startActionIds: number[] = []
        const endActionIds: number[] = []

        // load meta
        const templateMeta: WFMetaTemplate | undefined = loGet(this.templateMetas, [value[1][0].name])

        value[1][0].activities.forEach((activityChain, index) => {
            if (activityChain !== 'Init') {
                // add activity
                activity = {
                    id: index,
                    code: activityChain.code,
                    actionIds: [],
                    attributes: [],
                }
                activities.push(activity)

                // console.log('action from chain', actionChain)
                // set activity
                /*
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
                if (value[1][0].end.includes(index)) {
                    endActionIds.push(action.id)
                }
                */
            }
        })

        // transitions
        const transitions: WFTransition[] = []
        /**
        value[1][0].transitions.forEach((transactionChainToIds, index) => {
            if (index === 0) {
                transactionChainToIds.forEach((toId) => startActionIds.push(toId - 1))
            } else {
                transitions.push({ id: index - 1, toIds: transactionChainToIds.map((toId) => toId - 1) })
            }
        })
        */

        // settings
        const settings: WFSettings[] = []
        value[1][1].forEach((settingsItem, index) => {
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
        
        return {
            id: loToInteger(value[0]),
            version: loToString(value[1][0].version),
            code: value[1][0].code,
            //constants: [],
            //attributes: [],
            activities: activities,
            actions: actions,
            transactions: transitions,
            startActionIds: loUniq(startActionIds),
            endActionIds: loUniq(endActionIds),
            search: [StringHelper.toSearch(this.t('default.wf_templ_' + value[1][0].name))].join('-'),
            settings: settings,
        }
    }
}