import DaoGroupTransformer from "./transformers/DaoGroupTransformer";
import DaoDocsTransformer from "./transformers/DaoDocsTransformer";
import VoteLevelTransformer from "./transformers/VoteLevelTransformer";
import { DAO, DAOGroup, DAOGroupMember, DAOTokenHolder, DAOVoteLevel, DAOVoteType, DAOProposal } from "./types/dao";
import { DAODocs, DAODocsFile, DAODocsFileType } from "./types/docs";
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
import loSet from "lodash/set"
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
import { Staking, StakingDelegation, StakingWallet, StakingUserToDelegate } from "./types/staking";
import { UserInfoStaking } from "../nearBlockchain/types/staking";
import NumberHelper from "../utils/NumberHelper";
import { TreasuryLock } from "./types/treasury";
import TreasuryLockTransformer from "./transformers/TreasuryLockTransformer";
import FtMetadataLoader from "../ft/FtMetadataLoader";
import ProposalTransformer from "./transformers/ProposalTransformer";
import WFInstanceTransformer from "./transformers/WFInstanceTransformer";
import TreasuryAnalytics from "./analytics/TreasuryAnalytics";
import PromiseHelper from "../utils/PromiseHelper";
import { RewardPricelist } from "./types/rewards";
import RewardsPricelistTransformer from "./transformers/RewardsPricelistTransformer";

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
        const rewardsPricelists = await this.getRewards(groups)

        // token holders 
        // TODO: Is it good way to find members, form proposals??
        const members: string[] = this.getMembers()
        const tokenHolders: DAOTokenHolder[] = await this.getTokenHolders(staking.usersToDelegate, members)
        let walletToken: number | undefined = undefined
        tokenHolders.forEach((holder) => {
            if (holder.accountId == walletId) {
                walletToken = holder.amount
            }
        });
    
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
                    holded: this.getFtTreasuryHolded(staking),
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

        // load proposal settings
        const dataChainProposalSettings = await Promise.all(
            this.dataChain[6].map((proposalChain) => this.daoService.wfProposeSettings(proposalChain[0]) )
        ).catch((e) => {
            throw new Error(`DataChainProposalSettings[${this.id}] not loaded: ${e}`);
        })

        
        // save it to proposals
        dataChainProposalSettings.forEach((proposalSettings, index) => {
            this.dataChain[6][index][2] = proposalSettings
        })

        // load workflow instance
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

        // load workflow log
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

    /**
     * Load staking from blockchain smart contracts
     * 
     * @param walletId 
     * @returns 
     */
    async getStaking(walletId?: string): Promise<Staking> {
        let wallet: StakingWallet | null = null
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
                voteAmount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(user[1].delegated_vote_amount.toString() || '0', this.getFtDecimals())),
                value: index,
                text: user[0]
            })

            if (user[0] === walletId) {
                walletInfo = user[1]
            }
        })

        if (loIsNil(walletInfo) === false) {
            const userStaked = await this.stakingService.daoFtBalanceOf(this.id, walletId!)
            const delegations: StakingDelegation[] = (walletInfo!.delegated_amounts || []).filter((item) => true || item[0] !== walletId).map((item, index) => ({id: index + 1, accountId: item[0], voteAmount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(item[1], this.getFtDecimals()))}))
            const delegationsVoteAmountSum = loSum(delegations.filter((item) => item.accountId !== walletId!).map((item) => item.voteAmount))

            // compute delegators
            const delegators: StakingDelegation[] = []
            this.dataChain[14].filter((item) => item[0] !== walletId).forEach((user, index) => {
                user[1].delegated_amounts.filter((item) => item[0] === walletId).forEach((item) => {
                    delegators.push({
                        id: delegators.length,
                        accountId: user[0],
                        voteAmount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(item[1].toString() || '0', this.getFtDecimals())),
                    })
                })
            })
            const delegatorsAmount = loSum(delegators.map((item) => item.voteAmount)) || 0

            // console.log(walletInfo, typeof walletInfo)
            wallet = {
                staked: NumberHelper.parseNumber(NearUtils.amountFromDecimals(walletInfo!.vote_amount, this.getFtDecimals())), // userStaked
                voteAmount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(walletInfo!.delegated_vote_amount || '0', this.getFtDecimals())), 
                delegatedVoteAmount: delegationsVoteAmountSum,
                delegations,
                delegators,
                delegatorsAmount,
            }
        }

        const totalStaked = NumberHelper.parseNumber(NearUtils.amountFromDecimals(this.dataChain[13], this.getFtDecimals()))
        const totalVoteAmount: number = loSum(usersToDelegate.map((item) => item.voteAmount)) || 0
        const walletFtBalance: string | null = walletId ? await this.ftService.ftBalanceOf(walletId) : null
        const walletFtAmount = NumberHelper.parseNumber(NearUtils.amountFromDecimals(walletFtBalance || '0', this.getFtDecimals()))

        return {
            totalStaked,
            totalVoteAmount,
            walletFtAmount,
            wallet,
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
    getTreasuryTotalSupply(): number { return new Decimal(NearUtils.amountFromDecimals(this.dataChain[17], this.dataChain[9].decimals)).toNumber() }

    getFtTreasuryHolded(staking: Staking): number { return this.getTreasuryTotalSupply() - this.getTreasuryToken() }
    getFtTreasuryFree(treasuryLocks: TreasuryLock[]): number {
        const stats = TreasuryAnalytics.computeLockAssetStat(treasuryLocks, this.ftAccountId)
        return new Decimal(this.getTreasuryToken()).minus(stats.locked).toNumber()
    }

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
            Object.keys(proposal[1].v1.votes).forEach((voter: string) => {
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

    async getTokenHolders(usersToDelegate: StakingUserToDelegate[],  accountIds: string[] = []): Promise<DAOTokenHolder[]> {
        const tokenHolders: DAOTokenHolder[] = []
        /*
        const balances = await Promise.all(
            accountIds.map((member) => this.ftService!.ftBalanceOf(member))
        ).catch((e) => {
            throw new Error(`DAO[${this.id}] balances not loaded: ${e}`);
        });
    
        accountIds.forEach((accountId: string, index: number) => {
            tokenHolders.push({accountId: accountId, amount: new Decimal(NearUtils.amountFromDecimals(balances[index] ?? '0', this.getFtDecimals())).toNumber()})
        });
        */
        usersToDelegate.forEach((user) =>
            tokenHolders.push({accountId: user.accountId, amount: user.voteAmount})
        )

        return tokenHolders
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
