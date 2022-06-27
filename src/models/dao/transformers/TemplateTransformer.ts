import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAORights, DAOVoteType } from "../types/dao";
import moment from 'moment';
import loIsBoolean from "lodash/isBoolean"
import loToString from "lodash/toString"
import loToInteger from "lodash/toInteger"
import loUniq from "lodash/uniq"
import loGet from "lodash/get"
import loFind from "lodash/find"
import loSet from "lodash/set"
import loSnakeCase from "lodash/snakeCase"
import { WFAction, WFActivity, WFMetaTemplate, WFTransition, WFSettings, WFSettingsAction, WFTemplate} from "../types/workflow";
import { templateMetas } from "../data/workflowMeta"
import Rights from "../Rights";
import StringHelper from '../../utils/StringHelper'
import NearUtils from "@/models/nearBlockchain/Utils";
import VoteLevelTransformer from "./VoteLevelTransformer";

export default class TemplateTransformer implements TransformerInterface {
    private templateMetas: Record<string, WFMetaTemplate>;
    private t: Function;
    private voteLevelTransformer: TransformerInterface;

    constructor(t: Function) {
        this.templateMetas = templateMetas
        this.t = t
        this.voteLevelTransformer = new VoteLevelTransformer()
    }

    transform(value: any): WFTemplate {
        // console.log(template)
        let action: WFAction
        let activity: WFActivity | undefined
        // action and activity
        const activities: WFActivity[] = []
        const actions: WFAction[] = []
        const startActivityIds: number[] = []

        // load meta
        // const templateMeta: WFMetaTemplate | undefined = loGet(this.templateMetas, [value[1][0].name])

        value[1][0].activities.forEach((activityChain, index) => {
            if (activityChain !== 'init') {
                // add activity
                activity = {
                    id: index,
                    code: activityChain.activity.code,
                    automatic: activityChain.activity.automatic,
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
                    endActivityIds.push(action.id)
                }
                */
            } else {
                activities.push({
                    id: index,
                    code: activityChain,
                    automatic: true,
                    actionIds: [],
                    attributes: [],
                })
            }
        })

        // transitions
        const transitions: WFTransition[] = []
        value[1][0].transitions.forEach((transactionChain, index) => {
            if (index === 0) {
                transactionChain.forEach((transactionItem) => startActivityIds.push(transactionItem.activity_id))
            }
            transitions.push({ id: index, toIds: transactionChain.map((transactionItem) => transactionItem.activity_id) })
        })

        // settings
        const settings: WFSettings[] = []
        value[1][1].forEach((settingsItem, index) => {
            const settingsActivityRights: Record<number, DAORights[]> = {}
            // activity rights
            settingsItem.activity_rights.forEach((rightsChain, index) => {
                loSet(settingsActivityRights, [index], rightsChain.map((rightItem) => Rights.parse(rightItem)))
            })
            // settings
            settings.push({
                id: index,
                constants: [],
                proposeRights: settingsItem.allowed_proposers.map(item => Rights.parse(item)),
                voteRight: Rights.parse(settingsItem.allowed_voters),
                voteLevel: this.voteLevelTransformer.transform(settingsItem),
                activityRights: settingsActivityRights,
            })
        })
        
        return {
            id: loToInteger(value[0]),
            code: value[1][0].code,
            name: this.t('wf_templ_' + value[1][0].code),
            version: loToString(value[1][0].version),
            autoExecute: value[1][0].auto_exec,
            needStorage: value[1][0].need_storage,
            activities: activities,
            //constants: [],
            //attributes: [],
            transactions: transitions,
            startActivityIds: loUniq(startActivityIds),
            endActivityIds: value[1][0].end,
            settings: settings,
            search: [StringHelper.toSearch(this.t('wf_templ_' + value[1][0].code))].join('-'),
        }
    }
}