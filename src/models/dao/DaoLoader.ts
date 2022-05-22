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
import loIsNil from "lodash/isNil"
import loSum from "lodash/sum"
import loValues from "lodash/values"
import { templateMetas } from "./data/workflowMeta"
import NearUtils from "../nearBlockchain/Utils";
import DaoContractService from "../nearBlockchain/DaoContractService";
import FtContractService from "../nearBlockchain/FtContractService";
import StakingContractService from "../nearBlockchain/StakingContractService";
import NearAccountService from "../nearBlockchain/NearAccountService";
import { basicStaking } from "../../../tests/fixtures/staking"
import { listBasic } from "@/../tests/fixtures/treasury"; // TODO: Fixtures
import ServicePool from "./ServicePool";
import { ListItemDto } from "./types/admin";
import { Staking, StakingDelegation, StakingUserInfo, StakingUserToDelegate } from "./types/staking";
import { UserInfoStaking } from "../nearBlockchain/types/staking";
import NumberHelper from "../utils/NumberHelper";
import { TreasuryLock } from "./types/treasury";
import TreasuryLockTransformer from "./transformers/TreasuryLockTransformer";
import FtMetadataLoader from "../ft/FtMetadataLoader";

export default class DaoLoader {
    private id: string;
    private dataChain: any[];
    private t: Function;
    private daoInfo: ListItemDto | null;
    private servicePool: ServicePool;
    private daoService!: DaoContractService;
    private accountService!: NearAccountService;
    private ftAccountId!: string;
    private stakingAccountId!: string;
    private ftService!: FtContractService;
    private stakingService!: StakingContractService;
    private ftMetadataLoader: FtMetadataLoader;

    constructor(id: string, servicePool: ServicePool, t: Function, daoInfo: ListItemDto | null) {
        this.id = id
        this.servicePool = servicePool
        this.t = t
        this.daoInfo = daoInfo
        this.dataChain = []
        this.ftMetadataLoader = new FtMetadataLoader(servicePool)
    }

    async init(): Promise<void> {
        if (this.daoService === undefined) {
            this.daoService = this.servicePool.getContract(this.id)
        }

        if (this.accountService === undefined) {
            this.accountService = await this.servicePool.getAccount(this.id)
        }

        // TODO: It's not nice
        if (this.ftAccountId === undefined || this.stakingAccountId === undefined) {
            const stats = await this.daoService.statistics()
            this.ftAccountId = stats.token_id
            this.stakingAccountId = stats.staking_id
        }

        if (this.ftService === undefined) {
            this.ftService = this.servicePool.getFt(this.ftAccountId)
        }

        if (this.stakingService === undefined) {
            this.stakingService = this.servicePool.getStaking(this.stakingAccountId)
        }

        return;
    }

    async getDao(walletId?: string): Promise<DAO> {
        await this.load()

        const docs = this.getMedia()
        const voteLevels = this.getVoteLevels()
        const groups = this.getGroups()
        const tags = this.getGlobalTags()
        const staking = await this.getStaking(walletId)
        const treasuryLocks = await this.getTreasuryLocks()

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
            created: this.daoInfo?.created, // TODO: DAO created
            version: '1.0', // TODO: Add versioning
            storage: this.dataChain[11],
            docs: docs,
            voteLevels: voteLevels,
            groups: groups,
            tags: tags,
            tokenHolders: tokenHolders,
            templates: execute.templates,
            proposals: execute.proposals,
            workflows: execute.workflows,
            treasuryLocks: treasuryLocks, //listEmpty()
            staking: staking,
            settings: this.dataChain[7],
            statistics: this.dataChain[8],
        }
    }

    async load() {
        await this.init()

        this.dataChain = await Promise.all([
          this.daoService.wfTemplates(),
          this.daoService.groups(),
          this.daoService.tags('group'),
          this.daoService.tags('media'),
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve([]);
            }, 10);
          }), // 4: TODO: Migrate media list to resource this.daoService.getMediaList()
          this.daoService.tags('global'),
          this.daoService.proposals(0, 1000),
          this.daoService.settings(),
          this.daoService.statistics(), // 8: this.daoService.statistics(),
          this.ftService.ftMetadata(),
          this.accountService.getState(),
          this.daoService.storage(),
          this.ftService.ftBalanceOf(this.id), // 12: staking
          this.stakingService.daoFtTotalSupply(this.id),
          this.stakingService.daoUserList(this.id),
          this.daoService.partitionList(0, 1000), // 15: treasury
        ]).catch((e) => {
          throw new Error(`DAOHack[${this.id}] not loaded: ${e}`);
        });

        console.log(this.dataChain)
    }

    /**
     * Load treasury lock from blockchain dao smart contract
     * @returns 
     */
    async getTreasuryLocks(): Promise<TreasuryLock[]> {
        let lockItem: TreasuryLock
        const locks: TreasuryLock[] = []
        const transformer = new TreasuryLockTransformer(this.ftMetadataLoader)
        for (lockItem of this.dataChain[15]) {
            // console.log(lockItem)
            locks.push(await transformer.transform(lockItem))
        }
        return locks
    }

    /**
     * Load staking from blockchain smart contracts
     * 
     * @param walletId 
     * @returns 
     */
    async getStaking(walletId?: string): Promise<Staking> {
        let userInfo: StakingUserInfo | null = null
        let walletInfo: UserInfoStaking | null = null
        // let walletInfo: object | null = null
        const usersToDelegate: StakingUserToDelegate[] = []

        this.dataChain[14].forEach((user, index) => {
            //console.log(user)
            usersToDelegate.push({
                id: index,
                accountId: user[0],
                bio: null,
                tag: null, // TODO: Add from groups
                votesCasted: user[1].delegators.length,
                voteAmount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(user[1].delegated_vote_amount.toString() || '0', this.getFtDecimals()))
            })

            if (user[0] === walletId) {
                walletInfo = user[1]
            }
        })

        if (loIsNil(walletInfo) === false) {
            // const userStaked = await this.stakingService.daoFtBalanceOf(this.id, walletId!)
            const delegations: StakingDelegation[] = (walletInfo!.delegated_amounts || []).map((item, index) => ({id: index + 1, accountId: item[0], voteAmount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(item[1], this.getFtDecimals()))}))
            const delegationsVoteAmountSum = loSum(delegations.map((item) => item.voteAmount))
            // console.log(walletInfo, typeof walletInfo)
            userInfo = {
                staked: NumberHelper.parseNumber(NearUtils.amountFromDecimals(walletInfo!.vote_amount, this.getFtDecimals())), // userStaked
                voteAmount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(walletInfo!.delegated_vote_amount || '0', this.getFtDecimals())), 
                delegatedVoteAmount: delegationsVoteAmountSum,
                delegations: delegations,
                delegators: walletInfo!.delegators || [],
            }
        }

        return {
            totalStaked: NumberHelper.parseNumber(NearUtils.amountFromDecimals(this.dataChain[13], this.getFtDecimals())),
            userInfo,
            usersToDelegate,
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

    getFtDecimals() { return this.dataChain[9].decimals }

    getTreasuryToken(): number { return new Decimal(NearUtils.amountFromDecimals(this.dataChain[12], this.dataChain[9].decimals)).toNumber() }

    getFtTreasuryHolded(): number { return this.getTreasuryToken() }
    getFtTreasuryFree(): number { return new Decimal(this.getTreasuryToken()).minus(0).toNumber() } // TODO: Add minuts from locks

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
        return GenericsHelper.createIDValueFromObject(this.dataChain[3]?.map || {})
    }

    getGlobalTags(): IDValue[] {
        return GenericsHelper.createIDValueFromObject(this.dataChain[7].tags || {})
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
            accountIds.map((member) => this.ftService!.ftBalanceOf(member))
        ).catch((e) => {
            throw new Error(`DAO[${this.id}] balances not loaded: ${e}`);
        });
    
        accountIds.forEach((accountId: string, index: number) => {
            tokenHolders.push({accountId: accountId, amount: new Decimal(NearUtils.amountFromDecimals(balances[index] ?? '0', this.getFtDecimals())).toNumber()})
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
            workflowInstance = await this.daoService!.wfInstance(proposal[0])
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
                workflowLog = await this.daoService!.wfLog(proposal[0])
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
}
