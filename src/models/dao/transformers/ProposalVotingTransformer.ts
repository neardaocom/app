import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAOProposal, DAORights, DAOMember, DAOVote } from "../types/dao";
import moment from 'moment';
import loIsBoolean from "lodash/isBoolean"
import loToString from "lodash/toString"
import loToInteger from "lodash/toInteger"
import loUniq from "lodash/uniq"
import loGet from "lodash/get"
import loFind from "lodash/find"
import loSet from "lodash/set"
import loSnakeCase from "lodash/snakeCase"
import { WFAction, WFActivity, WFMetaTemplate, WFTransition, WFSettings, WFSettingsAction, WFTemplate } from "../types/workflow";
import { templateMetas } from "../data/workflowMeta"
import Rights from "../Rights";
import StringHelper from '../../utils/StringHelper'
import NearUtils from "@/models/nearBlockchain/Utils";
import VoteLevelTransformer from "./VoteLevelTransformer";
import { CodeValue } from "@/models/utils/types/generics";
import { ProposalVoting } from "../types/proposal";
import DateHelper from "@/models/utils/DateHelper";
import ProposalHelper from "../ProposalHelper";
import ProposalArgsTransformer from "./ProposalArgsTransformer";
import { MarketTemplate } from "../types/market";
import { DAODocs, DAODocsFile } from "../types/docs";
import DocsHelper from "../DocsHelper";

export default class ProposalVotingTransformer implements TransformerInterface {
    private templates: Record<number, WFTemplate>;
    private templatesMeta: MarketTemplate[];
    private members: DAOMember[];
    private daoTokenAmount: number;
    private walletId: string;
    private walletRights: DAORights[];
    private t: Function;
    private d: Function;
    private n: Function;
    private docs: DAODocs;
    private proposalArgsTransformer: TransformerInterface;

    constructor(
        templates: Record<number, WFTemplate>,
        templatesMeta: MarketTemplate[],
        members: DAOMember[],
        daoTokenAmount: number,
        walletId: string,
        walletRights: DAORights[],
        t: Function,
        d: Function,
        n: Function,
        docs: DAODocs
    ) {
        this.templates = templates
        this.templatesMeta = templatesMeta
        this.members = members
        this.daoTokenAmount = daoTokenAmount
        this.walletId = walletId
        this.walletRights = walletRights
        this.t = t
        this.d = d
        this.n = n
        this.docs = docs
        this.proposalArgsTransformer = new ProposalArgsTransformer(this.templates, this.templatesMeta, this.docs, t, d, n)
    }

    transform(value: any): ProposalVoting {
        // console.log(value)
        const template = loGet(this.templates, [value.templateId])
        // console.log(template)
        const settings = loFind(template.settings, { id: value.settingsId })
        // console.log(settings)
        const args = this.proposalArgsTransformer.transform(value)
        const choiceIndex = ProposalHelper.getChoice(value, this.walletId)

        const progress = ProposalHelper.getProgress(value.state, settings!, value.end)

        const trans = {
            id: value.id,
            code: template.code,
            title: this.t('default.wf_templ_' + template.code + '_v' + template.version + '_s' + value.workflowScenarioId + '_title', args),
            description: DocsHelper.getProposalDescription(this.docs, value.id),
            typeCode: template.code,
            type: this.t('default.wf_templ_' + template.code + '_v' + template.version + '_s' + value.workflowScenarioId),
            stateCode: value.state,
            state: this.t("default.proposal_state_" + value.state),
            workflowStateCode: value.workflow?.state,
            statusCode: ProposalHelper.getStatusCode(value.state, value.workflow?.state, progress),
            canVote: Rights.check(this.walletRights, [settings!.voteRight]),
            isOver: ProposalHelper.isOver(value, settings!),
            isVoted: ProposalHelper.isVoted(value, this.walletId),
            args: args,
            votingStats: ProposalHelper.getVotingStats(value, this.members, this.daoTokenAmount),
            duration: {
                value: value.end, // TODO: Rewrite to END
                date: this.d(value.end),
                time: DateHelper.toTimeString(value.end),
            },
            choiceIndex: choiceIndex,
            choice: (choiceIndex) ? this.t("default.vote_type_" + choiceIndex) : null,
            progress: progress,
            quorum: settings?.voteLevel.quorum,
            approveThreshold: settings?.voteLevel.approveThreshold,
            templateSettings: settings!,
            workflow: value.workflow,
            search: '',
        }

        trans.search = [
            StringHelper.toSearch(trans.title),
            StringHelper.toSearch(trans.duration.date),
            StringHelper.toSearch(trans.duration.time),
            StringHelper.toSearch(trans.type),
            StringHelper.toSearch(trans.state)
        ].join('-')

        //console.log(trans)
        return trans
    }
}