import { ProposalInputs } from "../nearBlockchain/types/dao";
import { TemplateSettings, TransitionLimit } from "../nearBlockchain/types/workflow";

import loSet from "lodash/set";
import { DAORights, DAOVoteLevel } from "./types/dao";
import { AppError } from "../utils/errors";
import NearUtils from "../nearBlockchain/Utils";
import Rights from "./Rights";

export default class ProposalBuilder {
    private description?: number;
    private templateId?: number;
    private templateSettingsId?: number;
    private storageKey?: string;
    private schedulerMsg?: string;
    private constants: Record<string, any> = {};
    private activityConstants: any[] = [];
    
    // template
    private proposeRights?: DAORights[];
    private voteRight?: DAORights;
    private voteLevel?: DAOVoteLevel;
    private activities: [DAORights[], TransitionLimit[]][] = [];

    constructor() {
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

    addActivityConstants() {
        this.activityConstants.push({
            constants: null,
            actions_constants: [
                null
            ]
        })
    }

    addTemplateVoteLevel(voteLevel: DAOVoteLevel) {
        this.voteLevel = voteLevel
    }

    addTemplateProposeRights(proposeRights: DAORights[]) {
        this.proposeRights = proposeRights
    }

    addTemplateVoteRights(voteRight: DAORights) {
        this.voteRight = voteRight
    }

    addTemplateActivity(rights: DAORights[], transationLimits: TransitionLimit[] ) {
        this.activities.push([rights, transationLimits])
    }


    create(): ProposalInputs {
        if (this.templateId === undefined) {
            throw new Error("TemplateId is not defined");
        }

        if (this.templateSettingsId === undefined) {
            throw new Error("TemplateSettingsId is not defined");
        }

        let templateSettings: TemplateSettings[] | null = null
        if ( this.voteLevel !== undefined || this.voteRight !== undefined || this.proposeRights !== undefined ) {
            // check
            console.log(this.activities)
            if (this.voteLevel === undefined || this.voteRight === undefined || this.proposeRights === undefined) {
                throw new AppError("voteLevel and this.voteRight and this.proposeRights must be added")
            }

            templateSettings = [{
                allowed_proposers: this.proposeRights.map((item) => Rights.toObject(item)),
                allowed_voters: Rights.toObject(this.voteRight!),
                activity_rights: this.activities.map((item) => item[0]).map((item) => item.map((right) => Rights.toObject(right))),
                transition_limits: this.activities.map((item) => item[1]),
                scenario: this.voteLevel!.type === 0 ? 'democratic' : 'token_weighted',
                duration: NearUtils.durationToChain(this.voteLevel!.duration),
                quorum: this.voteLevel!.quorum,
                approve_threshold: this.voteLevel!.approveThreshold,
                spam_threshold: this.voteLevel!.spamThreshold || 80,
                vote_only_once: this.voteLevel!.voteOnlyOnce,
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