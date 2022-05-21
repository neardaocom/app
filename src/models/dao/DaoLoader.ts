import DaoGroupTransformer from "./transformers/DaoGroupTransformer";
import DaoDocsTransformer from "./transformers/DaoDocsTransformer";
import VoteLevelTransformer from "./transformers/VoteLevelTransformer";
import { DAO, DAODocs, DAOExecute, DAODocsFile, DAODocsFileType, DAOGroup, DAOGroupMember, DAOTokenHolder, DAOVoteLevel, DAOVoteType, DAOProposal } from "./types/dao";
import { WFSettings, WFTemplate, WFInstance, WFInstanceLog, WFMetaTemplate } from "./types/workflow";
import Decimal from "decimal.js";
import { IDValue, CodeValue } from "../utils/types/generics";
import GenericsHelper from "../utils/GenericsHelper";
import loUniqWith from "lodash/uniqWith"
import loIsEqual from "lodash/isEqual"
import TemplateTransformer from "./transformers/TemplateTransformer";
import StringHelper from '../utils/StringHelper'
import loFind from "lodash/find"
import loGet from "lodash/get"
import loValues from "lodash/values"
import { templateMetas } from "./data/workflowMeta"
import NearUtils from "../nearBlockchain/Utils";
import DaoContractService from "../nearBlockchain/DaoContractService";
import NearAccountService from "../nearBlockchain/NearAccountService";
import { listBasic } from "../../../tests/fixtures/treasury";
import { basicStaking } from "../../../tests/fixtures/staking"

export default class DaoLoader {
    private id: string;
    private dataChain: any[];
    private t: Function;
    private service: DaoContractService;
    private account: NearAccountService;

    constructor(id: string, service: DaoContractService, account: NearAccountService, t: Function) {
        this.id = id
        this.dataChain = []
        this.t = t
        this.service = service
        this.account = account
    }

    async getDao(walletId?: string): Promise<DAO> {
        await this.load()

        const docs = this.getMedia()
        const voteLevels = this.getVoteLevels()
        const groups = this.getGroups()
        const tags = this.getGlobalTags()

        // token holders 
        // TODO: Is it good way to find members, form proposals??
        const members: string[] = this.getMembers()
        const tokenHolders: DAOTokenHolder[] = await this.getTokenHolders(members)
        let walletToken: number | undefined = undefined
        tokenHolders.forEach((holder) => {
            if (holder.accountId == walletId) {
                walletToken = holder.amount
            }
        });
    
        // templates
        const execute = await this.getExecute()

        return {
            name: this.dataChain[7].name,
            purpose: this.dataChain[7].purpose,
            wallet: this.id,
            treasury: {
                token: {
                    meta: {
                        name: this.dataChain[9].name,
                        short: this.dataChain[9].symbol, // TODO: short -> symbol
                        accountId: this.id,
                        amount: this.dataChain[8].ft_total_supply,
                        decimals: this.dataChain[9].decimals,
                    },
                    free: this.getFtTreasuryFree(),
                    holded: this.getFtTreasuryHolded(),
                    owned: walletToken,
                },
                near: NearUtils.yoctoToNear(this.dataChain[10].amount),
                nearStorageLocked: 6.7, // TODO: Add storage locked
                fts: [],
            },
            location: '',
            lang: '', // TODO: Add lang to DAO
            created: new Date(), // TODO: DAO created
            storage: this.dataChain[11],
            docs: docs,
            voteLevels: voteLevels,
            groups: groups,
            tags: tags,
            tokenHolders: tokenHolders,
            templates: execute.templates,
            proposals: execute.proposals,
            workflows: execute.workflows,
            treasuryLocks: listBasic(), //listEmpty()
            staking: basicStaking(),
        }
    }

    getAccountId(): string {
        return this.id.split('.')[0];
    }

    getGroupTags(): string[] {
        return this.dataChain[2];
    }

    getGroups(): DAOGroup[] {
        const groupTrasformer = new DaoGroupTransformer(this.getGroupTags());
        return this.dataChain[1].map(group => groupTrasformer.transform(group, {}) as DAOGroup);
    }

    getFtTreasuryHolded(): number { return new Decimal(this.dataChain[8].ft_total_distributed).toNumber();}
    getFtTreasuryFree(): number { return new Decimal(this.dataChain[8].ft_total_supply).minus(this.dataChain[8].ft_total_locked).toNumber()}

    getMembers(): string[] {
        const members: string[] = []
        // search in groups
        this.getGroups().forEach((group: DAOGroup) => {
            group.members.forEach((member: DAOGroupMember) => {
                if (members.includes(member.accountId) === false) {
                    members.push(member.accountId)
                }
            })
        })
        // search in voters
        this.dataChain[6].forEach((proposal) => { // get list of voting token holders
            // voters
            Object.keys(proposal[1].Curr.votes).forEach((voter: string) => {
                if (members.includes(voter) === false) {
                    members.push(voter)
                }
            })
        })
        return members;
    }

    getMediaTags(): IDValue[] {
        return GenericsHelper.createIDValueFromObject(this.dataChain[3].map)
    }

    getGlobalTags(): IDValue[] {
        return GenericsHelper.createIDValueFromObject(this.dataChain[7].tags)
    }

    // TODO: Direct mapping from data source?
    getMediaCategories(): IDValue[] {
        const categories: IDValue[] = []
        let i = 0
        this.dataChain[4].forEach((item) => { 
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

    getMedia(): DAODocs {
        const docs: DAODocs = {
            files: [],
            categories: this.getMediaCategories(),
            tags: this.getMediaTags(),
        }

        const transformer = new DaoDocsTransformer(docs.categories, docs.tags)

        this.dataChain[4].forEach((element) => {
            docs.files.push(transformer.transform(element, {}))
        });

        return docs
    }

    getVoteLevels(): DAOVoteLevel[] {
        const transformer = new VoteLevelTransformer()
        const voteLevels: DAOVoteLevel[] = []
        this.dataChain[0].forEach((template) => {return 
            template[1][1].forEach((settingsItem) => {
                voteLevels.push(transformer.transform(settingsItem, {}))
            })
        })
        loUniqWith(voteLevels, loIsEqual)
        return voteLevels
    }

    getTemplates(): WFTemplate[] {
        const templates: WFTemplate[] = []

        const transformer = new TemplateTransformer(this.t)
        
        // console.log("Template", dataHack[0])
        this.dataChain[0].forEach((template) => {
            templates.push(transformer.transform(template, {}))
        });

        return templates;
    }

    async getTokenHolders(accountIds: string[]): Promise<DAOTokenHolder[]> {
        const tokenHolders: DAOTokenHolder[] = []
        const balances = await Promise.all(
            accountIds.map((member) => this.service.getFtBalanceOf(member))
        ).catch((e) => {
            throw new Error(`DAO[${this.id}] balances not loaded: ${e}`);
        });
    
        accountIds.forEach((accountId: string, index: number) => {
            tokenHolders.push({accountId: accountId, amount: new Decimal(balances[index] ?? 0).toNumber()})
        });

        return tokenHolders
    }

    async getExecute(): Promise<DAOExecute> {
        const templates: WFTemplate[] = this.getTemplates()
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
    
        for (const proposal of this.dataChain[6]) {
            actionLogs = []
            // console.log(proposal)
            workflowInstance = await this.service.getWfInstance(proposal[0])
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
                workflowLog = await this.service.getWfInstanceLog(proposal[0])
                workflowLog?.forEach((log, index) => {
                    //console.log('Log', log)
                    actionLogs.push({
                        id: index,
                        actionId: log.action_id - 1,
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
                workflowAddSettingsId: proposal[1].Curr.workflow_add_settings_id,
                inputs: proposalInputs,
                constants: proposalConstants,
                content: proposal[1].Curr.content ?? {},
            })
    
            workflows.push({
                id: proposal[0],
                templateId: proposal[1].Curr.workflow_id,
                settingsId: proposal[1].Curr.workflow_settings_id,
                state: workflowInstance[0].state,
                storage: workflowInstance[1].storage_key,
                inputs: proposalInputs,
                constants: proposalConstants,
                actionLastId: (workflowInstance[0].current_activity_id === 0) ? undefined : (workflowInstance[0].current_activity_id - 1),
                actionLogs: actionLogs,
                search: [StringHelper.toSearch('#' + proposal[0]), proposalTemplate?.search ?? ''].join('-'),
            })
        }

        return {
            templates: templates,
            proposals: proposals,
            workflows: workflows,
        }
    }

    async load() {
        this.dataChain = await Promise.all([
          this.service.getWfTemplates(),
          this.service.getGroups(),
          this.service.getTags('group'),
          this.service.getTags('media'),
          this.service.getMediaList(),
          this.service.getTags('global'),
          this.service.getProposals(0, 1000),
          this.service.getDaoSettings(),
          this.service.getStats(),
          this.service.getFtMetadata(),
          this.account.getState(),
          this.service.getStorage(),
        ]).catch((e) => {
          throw new Error(`DAOHack[${this.id}] not loaded: ${e}`);
        });

        console.log(this.dataChain)
    }
}