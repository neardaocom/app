import DaoGroupTransformer from "./transformers/DaoGroupTransformer";
import DaoDocsTransformer from "./transformers/DaoDocsTransformer";
import VoteLevelTransformer from "./transformers/VoteLevelTransformer";
import { DAO, DAOGroup, DAOVoteLevel, DAOProposal } from "./types/dao";
import { DAODocs } from "./types/docs";
import { WFTemplate } from "./types/workflow";
import Decimal from "decimal.js";
import { IDValue } from "../utils/types/generics";
import GenericsHelper from "../utils/GenericsHelper";
import loUniqWith from "lodash/uniqWith"
import loIsEqual from "lodash/isEqual"
import TemplateTransformer from "./transformers/TemplateTransformer";
import loSet from "lodash/set"
import NearUtils from "../nearBlockchain/Utils";
import DaoContractService from "../nearBlockchain/DaoContractService";
import FtContractService from "../nearBlockchain/FtContractService";
import StakingContractService from "../nearBlockchain/StakingContractService";
import NearAccountService from "../nearBlockchain/NearAccountService";
import ServicePool from "./ServicePool";
import { ListItemDto } from "./types/admin";
import { TreasuryLock } from "./types/treasury";
import TreasuryLockTransformer from "./transformers/TreasuryLockTransformer";
import FtMetadataLoader from "../ft/FtMetadataLoader";
import ProposalTransformer from "./transformers/ProposalTransformer";
import WFInstanceTransformer from "./transformers/WFInstanceTransformer";
import TreasuryAnalytics from "./analytics/TreasuryAnalytics";
import PromiseHelper from "../utils/PromiseHelper";
import { RewardPricelist } from "./types/rewards";
import RewardsPricelistTransformer from "./transformers/RewardsPricelistTransformer";
import DaoHelper from "./DaoHelper";
import DaoStaking from "./DaoStaking";
import Ft from "../ft/Ft";

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
    private daoStaking!: DaoStaking;

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
            const settings = await this.daoService.settings()
            this.ftAccountId = settings.token_id
            this.stakingAccountId = settings.staking_id
        }

        if (this.ftService === undefined) {
            this.ftService = this.servicePool.getFt(this.ftAccountId)
        }

        if (this.stakingService === undefined) {
            this.stakingService = this.servicePool.getStaking(this.stakingAccountId)
        }

        if (this.daoStaking === undefined) {
            this.daoStaking = new DaoStaking(this.id, this.stakingService, this.ftService)
        } 

        return;
    }

    async getDao(walletId?: string): Promise<DAO> {
        await this.load()

        const docs = this.getMedia()
        const voteLevels = this.getVoteLevels()
        const groups = this.getGroups()
        const tags = this.getGlobalTags()
        const staking = await this.daoStaking.load(this.dataChain[14], this.dataChain[13], this.getFtDecimals(), walletId)
        const treasuryLocks = await this.getTreasuryLocks()
        const rewardsPricelists = await this.getRewards(groups)

        const members = DaoHelper.getMembers(groups, staking)

        let walletTokenAmount: number | string | undefined = undefined
        if (walletId) {
            const ft = new Ft(this.servicePool, this.ftMetadataLoader)
            walletTokenAmount = await ft.getBalance(this.ftAccountId, walletId)
        }
    
        // templates
        const templates = this.getTemplates()
        const proposals = await this.getProposals()

        return {
            name: this.dataChain[7].name,
            purpose: this.dataChain[7].purpose,
            wallet: this.id,
            treasury: {
                token: {
                    meta: {
                        name: this.dataChain[9].name,
                        symbol: this.dataChain[9].symbol,
                        accountId: this.id,
                        amount: this.dataChain[8].ft_total_supply,
                        decimals: this.dataChain[9].decimals,
                    },
                    free: this.getFtTreasuryFree(treasuryLocks),
                    holded: this.getFtTreasuryHolded(),
                    owned: walletTokenAmount,
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
            members,
            templates: templates || {},
            proposals: proposals || [],
            treasuryLocks: treasuryLocks, //listEmpty()
            staking: staking,
            settings: this.dataChain[7],
            statistics: this.dataChain[8],
            rewardsPricelists: rewardsPricelists,
        }
    }

    async load() {
        await this.init()

        this.dataChain = await Promise.all([
          this.daoService.wfTemplates(),
          this.daoService.groups(),
          this.daoService.tags('group'),
          this.daoService.tags('media'),
          this.daoService.mediaList(0, 1000), // 4: Media
          this.daoService.tags('global'),
          this.daoService.proposals(0, 1000),
          this.daoService.settings(),
          this.daoService.statistics(), // 8: this.daoService.statistics(),
          this.ftService.ftMetadata(),
          this.accountService.state(),
          this.daoService.storage(),
          this.ftService.ftBalanceOf(this.id), // 12: staking
          this.stakingService.daoFtTotalSupply(this.id),
          this.stakingService.daoUserList(this.id),
          this.daoService.partitionList(0, 1000), // 15: treasury
          this.daoService.rewardList(1, 1000),// 16: reward list
          this.ftService.ftTotalSupply(), // 17: staking
        ]).catch((e) => {
          throw new Error(`DataChain[${this.id}] not loaded: ${e}`);
        });        

        // LOAD PROPOSAL SETTINGS
        const dataChainProposalSettings = await Promise.all(
            this.dataChain[6].map((proposalChain) => this.daoService.wfProposeSettings(proposalChain[0]) )
        ).catch((e) => {
            throw new Error(`DataChainProposalSettings[${this.id}] not loaded: ${e}`);
        })
        // save it to proposals
        dataChainProposalSettings.forEach((proposalSettings, index) => {
            this.dataChain[6][index][2] = proposalSettings
        })

        // LOAD WORKFLOW INSTANCE
        const dataChainWfInstance = await Promise.all(
            this.dataChain[6].map((proposalChain) =>
                proposalChain[1].v1.state === 'accepted' ? this.daoService.wfInstance(proposalChain[0]) : PromiseHelper.createPromiseTimeout(null)
            )
        ).catch((e) => {
            throw new Error(`DataChainProposalSettings[${this.id}] not loaded: ${e}`);
        })
        // save it to proposals
        dataChainWfInstance.forEach((wfInstance, index) => {
            this.dataChain[6][index][3] = wfInstance
        })

        // LOAD WORKFLOW LOG
        const dataChainWfLog = await Promise.all(
            this.dataChain[6].map((proposalChain) =>
                proposalChain[1].v1.state === 'accepted' ? this.daoService.wfLog(proposalChain[0]) : PromiseHelper.createPromiseTimeout(null)
            )
        ).catch((e) => {
            throw new Error(`DataChainProposalSettings[${this.id}] not loaded: ${e}`);
        })
        // save it to proposals
        dataChainWfLog.forEach((wfLog, index) => {
            this.dataChain[6][index][4] = wfLog
        })

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
     * Transform rewards
     * @returns 
     */
     async getRewards(groups: DAOGroup[]): Promise<RewardPricelist[]> {
        const rewards: RewardPricelist[] = []
        const transformer = new RewardsPricelistTransformer(this.ftMetadataLoader, groups)
        for (let i = 0; i < this.dataChain[16].length; i++) {
            // console.log(lockItem)
            rewards.push(await transformer.transform(this.dataChain[16][i]))
        }
        return rewards
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

    // amount in treasury
    getTreasuryToken(): number { return new Decimal(NearUtils.amountFromDecimals(this.dataChain[12], this.dataChain[9].decimals)).toNumber() }
    // amount of tokens
    getTreasuryTotalSupply(): number { return new Decimal(NearUtils.amountFromDecimals(this.dataChain[17], this.dataChain[9].decimals)).toNumber() }
    // amount holded
    getFtTreasuryHolded(): number { return this.getTreasuryTotalSupply() - this.getTreasuryToken() }

    // amount of free tokens in treasury
    getFtTreasuryFree(treasuryLocks: TreasuryLock[]): number {
        const stats = TreasuryAnalytics.computeLockAssetStat(treasuryLocks, this.ftAccountId)
        return new Decimal(this.getTreasuryToken()).minus(stats.locked).toNumber()
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
            const bool = categories.some(category => category.value === item[1].category)
            if(bool === false){
                categories.push({
                    id: i,
                    value: item[1].category
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

        this.dataChain[4].forEach((fileChain) => {
            docs.files.push(transformer.transform(fileChain))
        });

        return docs
    }

    getVoteLevels(): DAOVoteLevel[] {
        const transformer = new VoteLevelTransformer()
        const voteLevels: DAOVoteLevel[] = []
        this.dataChain[0].forEach((template) => {
            template[1][1].forEach((settingsItem) => {
                voteLevels.push(transformer.transform(settingsItem))
            })
        })
        loUniqWith(voteLevels, loIsEqual)
        return voteLevels
    }

    getTemplates(): Record<number, WFTemplate> {
        const templates: Record<number, WFTemplate> = {}
        let template: WFTemplate

        const transformer = new TemplateTransformer(this.t)
        
        // console.log("Template", dataHack[0])
        this.dataChain[0].forEach((templateChain) => {
            template = transformer.transform(templateChain)
            loSet(templates, [template.id], template)
        });

        return templates;
    }

    async getProposals(): Promise<DAOProposal[]> {
        const proposals: DAOProposal[] = []
        let proposal: DAOProposal

        const proposalTransformer = new ProposalTransformer()
        const wfInstanceTransformer = new WFInstanceTransformer()
    
        //console.log(this.dataChain[6])
        for (let i = 0; i < this.dataChain[6].length; i++) {
            proposal = proposalTransformer.transform(this.dataChain[6][i])
            if (this.dataChain[6][i][3] !== null) {
                proposal.workflow = wfInstanceTransformer.transform(this.dataChain[6][i])
            }
            proposals.push(proposal)
        }

        //console.log(proposals)

        return proposals
    }
}
