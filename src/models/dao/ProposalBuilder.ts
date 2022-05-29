import { ProposalInputs } from "../nearBlockchain/types/dao";
import { TemplateSettings, TransitionLimit } from "../nearBlockchain/types/workflow";

import loSet from "lodash/set";
import loUnset from "lodash/unset";
import { DAORights, DAOVoteLevel } from "./types/dao";
import { AppError } from "../utils/errors";
import NearUtils from "../nearBlockchain/Utils";
import Rights from "./Rights";
import WfProviderContract from "../nearBlockchain/WfProviderContractService";

export default class ProposalBuilder {
    private service: WfProviderContract;

    private description?: number;
    private templateId?: number;
    private templateSettingsId?: number;
    private storageKey?: string;
    private schedulerMsg?: string;
    private constants: Record<string, any> = {};
    private activityConstants: any[] = [];
    
    // template
    private templateWorkflowId?: number;
    private templateProposeRights?: DAORights[];
    private templateVoteRight?: DAORights;
    private templateVoteLevel?: DAOVoteLevel;
    private templateActivitiesRights: DAORights[][] = [];

    constructor(service: WfProviderContract) {
        this.service = service
    }

    addTemplateId(templateId: number) {
        this.templateId = templateId
    }

    addTemplateSettingsId(templateSettingsId: number) {
        this.templateSettingsId = templateSettingsId
    }

    addStorageKey(key: string) {
        this.storageKey = key
    }

    addSchedulerMsg(msg: string) {
        this.schedulerMsg = msg
    }

    addConstantString(key: string, value: string) {
        loSet(this.constants, key, {'string': value})
    }

    addConstantNumber(key: string, value: number) {
        loSet(this.constants, key, {'u64': value})
    }

    addConstantBigNumber(key: string, value: string) {
        loSet(this.constants, key, {'u128': value})
    }

    addActivity() {
        this.activityConstants.push({
            constants: null,
            actions_constants: [{
                map: {}
            }]
        })
    }

    addActivityActionConstant(key: string, value: object) {
        loSet(this.activityConstants[this.activityConstants.length - 1].actions_constants[0].map, [key], value)
    }

    addActivityActionConstantString(key: string, value: string) {
        this.addActivityActionConstant(key, {'string': value})
    }

    addActivityActionConstantNumber(key: string, value: number) {
        this.addActivityActionConstant(key, {'u64': value})
    }

    addActivityActionConstantBigNumber(key: string, value: string) {
        this.addActivityActionConstant(key, {'u128': value})
    }

    addTemplateWorflowId(workflowId: number) {
        this.templateWorkflowId = workflowId
    }

    addTemplateVoteLevel(templateVoteLevel: DAOVoteLevel) {
        this.templateVoteLevel = templateVoteLevel
    }

    addTemplateProposeRights(templateProposeRights: DAORights[]) {
        this.templateProposeRights = templateProposeRights
    }

    addTemplateVoteRights(templateVoteRight: DAORights) {
        this.templateVoteRight = templateVoteRight
    }

    addTemplateActivity(rights: DAORights[]) {
        this.templateActivitiesRights.push(rights)
    }


    async create(): Promise<ProposalInputs> {
        if (this.templateId === undefined) {
            throw new Error("TemplateId is not defined");
        }

        if (this.templateSettingsId === undefined) {
            throw new Error("TemplateSettingsId is not defined");
        }

        let templateSettings: TemplateSettings[] | null = null
        if ( this.templateWorkflowId !== undefined || this.templateVoteLevel !== undefined || this.templateVoteRight !== undefined || this.templateProposeRights !== undefined ) {
            // check
            if (this.templateWorkflowId === undefined || this.templateVoteLevel === undefined || this.templateVoteRight === undefined || this.templateProposeRights === undefined) {
                throw new AppError("templateWorkflowId and templateVoteLevel and this.templateVoteRight and this.templateProposeRights must be added")
            }

            // load template from provider
            const templateProvider = await this.service.wfTemplate(this.templateWorkflowId)
            // console.log(templateProvider[0].transitions)

            templateSettings = [{
                allowed_proposers: this.templateProposeRights.map((item) => Rights.toObject(item)),
                allowed_voters: Rights.toObject(this.templateVoteRight!),
                activity_rights: this.templateActivitiesRights.map((item) => item.map((right) => Rights.toObject(right))),
                transition_limits: templateProvider[0].transitions.map((transition) =>
                    transition.map((transitionItem) => ({ to: transitionItem.activity_id, limit: 100})
                )),
                scenario: this.templateVoteLevel!.type === 0 ? 'democratic' : 'token_weighted',
                duration: NearUtils.durationToChain(this.templateVoteLevel!.duration),
                quorum: this.templateVoteLevel!.quorum,
                approve_threshold: this.templateVoteLevel!.approveThreshold,
                spam_threshold: this.templateVoteLevel!.spamThreshold || 80,
                vote_only_once: this.templateVoteLevel!.voteOnlyOnce,
                deposit_propose: NearUtils.nearToYocto(1),
                deposit_vote: '1',
                deposit_propose_return: 0,
                constants: null
            }]
        }
    

        return {
            description: this.description || null,
            template_id: this.templateId,
            template_settings_id: this.templateSettingsId,
            propose_settings: {
                constants: {
                    map: this.constants
                },
                activity_constants: [ // TODO: add activity constants
                    null,
                    ...this.activityConstants,
                ],
                storage_key: this.storageKey || null,
            },
            template_settings: templateSettings,
            scheduler_msg: this.schedulerMsg || null,
        }
    }
}