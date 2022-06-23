import { ProposalInputs } from "../nearBlockchain/types/dao";
import { TemplateSettings, TransitionLimit } from "../nearBlockchain/types/workflow";

import loSet from "lodash/set";
import loFind from "lodash/find";
import loTimes from "lodash/times";
import { DAORights, DAOVoteLevel } from "./types/dao";
import { AppError, NotFoundError } from "../utils/errors";
import NearUtils from "../nearBlockchain/Utils";
import Rights from "./Rights";
import WfProviderContract from "../nearBlockchain/WfProviderContractService";
import { WFSettings, WFTemplate } from "./types/workflow";
import { Media } from "../nearBlockchain/types/resource";

export default class ProposalBuilder {
    protected service: WfProviderContract;
    protected daoTemplates: Record<number, WFTemplate>;

    // basic
    protected template?: WFTemplate;
    protected templateSettings?: WFSettings;
    protected description?: Media | null;
    protected schedulerMsg?: string;
    
    // propose settings
    protected proposeSettingsConstants: Record<string, any> = {};
    protected proposeSettingsActivity: any[] = [];
    protected proposeSettingsStorageKey?: string;


    
    // template settings
    protected templateSettingsWorkflowId?: number;
    protected templateSettingsProposeRights?: DAORights[];
    protected templateSettingsVoteRight?: DAORights;
    protected templateSettingsVoteLevel?: DAOVoteLevel;
    protected templateSettingsActivitiesRights: DAORights[][] = [];

    constructor(service: WfProviderContract, daoTemplates: Record<number, WFTemplate>) {
        this.service = service
        this.daoTemplates = daoTemplates
    }

    addTemplateByCode(templateCode: string) {
        this.template = loFind(this.daoTemplates, {code: templateCode})
        if (this.template === undefined) {
            throw new NotFoundError('TemplateCode[' + templateCode + '] not found in DAO')
        }
    }

    addTemplateSettingsId(templateSettingsId: number) {
        this.templateSettings = loFind(this.template?.settings, {id: templateSettingsId})
        if (this.templateSettings === undefined) {
            throw new NotFoundError('TemplateSettingsId[' + templateSettingsId + '] not found in DAO Template')
        }
    }

    addDescription(media: Media | null) {
        this.description = media
    }

    addSchedulerMsg(msg: string) {
        this.schedulerMsg = msg
    }
    
    addProposeSettingsScenario(scenarioId: number) {
        loSet(this.proposeSettingsConstants, 's', {'u64': scenarioId})
    }

    addProposeSettingsStorageKey(key: string) {
        this.proposeSettingsStorageKey = key
    }

    addProposeSettingsConstantString(key: string, value: string) {
        loSet(this.proposeSettingsConstants, key, {'string': value})
    }

    addProposeSettingsConstantNumber(key: string, value: number) {
        loSet(this.proposeSettingsConstants, key, {'u64': value})
    }

    addProposeSettingsConstantBigNumber(key: string, value: string) {
        loSet(this.proposeSettingsConstants, key, {'u128': value})
    }

    addActivity(actionCount: number = 1) {
        this.proposeSettingsActivity.push({
            constants: null,
            actions_constants: loTimes(actionCount, () => ({ map: {} }))
        })
    }

    addActivityEmpty() {
        this.proposeSettingsActivity.push(null)
    }

    addActivityConstant(key: string, value: object) {
        loSet(this.proposeSettingsActivity[this.proposeSettingsActivity.length - 1].constants, ['map', key], value)
    }

    addActivityConstantString(key: string, value: string) {
        this.addActivityConstant(key, {'string': value})
    }

    addActivityConstantNumber(key: string, value: number) {
        this.addActivityConstant(key, {'u64': value})
    }

    addActivityConstantBigNumber(key: string, value: string) {
        this.addActivityConstant(key, {'u128': value})
    }

    addActivityActionConstant(id: number, key: string, value: object) {
        loSet(this.proposeSettingsActivity[this.proposeSettingsActivity.length - 1].actions_constants, [id, 'map', key], value)
    }

    addActivityActionConstantString(id: number, key: string, value: string) {
        this.addActivityActionConstant(id, key, {'string': value})
    }

    addActivityActionConstantNumber(id: number, key: string, value: number) {
        this.addActivityActionConstant(id, key, {'u64': value})
    }

    addActivityActionConstantBigNumber(id: number, key: string, value: string) {
        this.addActivityActionConstant(id, key, {'u128': value})
    }

    addActivityActionConstantBoolean(id: number, key: string, value: boolean) {
        this.addActivityActionConstant(id, key, {'bool': value})
    }

    addActivityActionConstantStrings(id: number, key: string, value: string[]) {
        this.addActivityActionConstant(id, key, {'vec_string': value})
    }

    addActivityActionConstantNumbers(id: number, key: string, value: number[]) {
        this.addActivityActionConstant(id, key, {'vec_u64': value})
    }

    addActivityActionConstantBigNumbers(id: number, key: string, value: string[]) {
        this.addActivityActionConstant(id, key, {'vec_u128': value})
    }

    addActivityActionConstantBooleans(id: number, key: string, value: boolean[]) {
        this.addActivityActionConstant(id, key, {'vec_bool': value})
    }

    addTemplateSettingsWorflowId(workflowId: number) {
        this.templateSettingsWorkflowId = workflowId
    }

    addTemplateSettingsVoteLevel(templateSettingsVoteLevel: DAOVoteLevel) {
        this.templateSettingsVoteLevel = templateSettingsVoteLevel
    }

    addTemplateSettingsProposeRights(templateSettingsProposeRights: DAORights[]) {
        this.templateSettingsProposeRights = templateSettingsProposeRights
    }

    addTemplateSettingsVoteRights(templateSettingsVoteRight: DAORights) {
        this.templateSettingsVoteRight = templateSettingsVoteRight
    }

    addTemplateSettingsActivity(rights: DAORights[]) {
        this.templateSettingsActivitiesRights.push(rights)
    }


    async create(): Promise<ProposalInputs> {
        if (this.template === undefined) {
            throw new Error("Template is not defined");
        }

        if (this.templateSettings === undefined) {
            throw new Error("TemplateSettings is not defined");
        }

        const templateSettings: TemplateSettings[] = []
        if ( this.templateSettingsWorkflowId !== undefined || this.templateSettingsVoteLevel !== undefined || this.templateSettingsVoteRight !== undefined || this.templateSettingsProposeRights !== undefined ) {
            // check
            if (this.templateSettingsWorkflowId === undefined || this.templateSettingsVoteLevel === undefined || this.templateSettingsVoteRight === undefined || this.templateSettingsProposeRights === undefined) {
                throw new AppError("templateSettingsWorkflowId and templateSettingsVoteLevel and this.templateSettingsVoteRight and this.templateSettingsProposeRights must be added")
            }

            // load template from provider
            const templateProvider = await this.service.wfTemplate(this.templateSettingsWorkflowId)
            // console.log(templateProvider[0].transitions)

            templateSettings.push({
                allowed_proposers: this.templateSettingsProposeRights.map((item) => Rights.toObject(item)),
                allowed_voters: Rights.toObject(this.templateSettingsVoteRight!),
                activity_rights: this.templateSettingsActivitiesRights.map((item) => item.map((right) => Rights.toObject(right))),
                transition_limits: templateProvider[0].transitions.map((transition) =>
                    transition.map((transitionItem) => ({ to: transitionItem.activity_id, limit: 100})
                )),
                scenario: this.templateSettingsVoteLevel!.type,
                duration: NearUtils.durationToChain(this.templateSettingsVoteLevel!.duration),
                quorum: this.templateSettingsVoteLevel!.quorum,
                approve_threshold: this.templateSettingsVoteLevel!.approveThreshold,
                spam_threshold: this.templateSettingsVoteLevel!.spamThreshold || 80,
                vote_only_once: this.templateSettingsVoteLevel!.voteOnlyOnce,
                deposit_propose: NearUtils.nearToYocto(1),
                deposit_vote: '1',
                deposit_propose_return: 0,
                constants: null
            })
        }
    

        return {
            description: this.description || null,
            template_id: this.template.id,
            template_settings_id: this.templateSettings.id,
            propose_settings: {
                constants: {
                    map: this.proposeSettingsConstants
                },
                activity_constants: [ // TODO: add activity constants
                    null,
                    ...this.proposeSettingsActivity,
                ],
                storage_key: this.proposeSettingsStorageKey || null,
            },
            template_settings: templateSettings,
            scheduler_msg: this.schedulerMsg || null,
        }
    }
}