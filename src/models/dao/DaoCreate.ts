import Decimal from "decimal.js";
import DaoBuilder from "./DaoBuilder";
import FactoryContractService from "../nearBlockchain/FactoryContractService";
import WfProviderContractService from "../nearBlockchain/WfProviderContractService";
import NearUtils from "../nearBlockchain/Utils";
import Utils from "./Utils";
import ObjectHelper from "../utils/ObjectHelper";
import { NearConfig } from "@/config/near";
import DateHelper from "../utils/DateHelper";

export default class DaoCreate {
    private service: FactoryContractService;
    private provider: WfProviderContractService;
    private config: NearConfig;
    private t: Function;

    constructor(service: FactoryContractService, provider: WfProviderContractService, config: NearConfig, t: Function) {
        this.service = service
        this.provider = provider
        this.config = config
        this.t = t
    }

    async create(
        name: string, purpose: string, accountId: string, ftAccountId: string, ftAmount: number, ftDecimals: number,
        councilSharePercent: number, councilSharePercentInit: number, council: string[], councilUnlokingDuration: number,
        voteApproveThreshold: number, voteQuorum: number, voteDuration: number
    ) {
        // build token
        const builder = new DaoBuilder()
        // basis
        builder.addTokenId(ftAccountId)
        builder.addStakingId(this.config.stakingAccountId)
        builder.addTotalSupply(new Decimal(ftAmount).toNumber())
        builder.addSettings(name, purpose, [], this.config.daoFactoryAccountId, this.config.wfProviderAccountId, this.config.resourceProviderAccountId, this.config.schedulerServiceAccountId)
        builder.addGroup(this.t("default.council"), council, null, 0)
        // workflow
        const standardFncalls = await this.provider.standardFncalls()
        const workflowWfAdd = await this.provider.defaultWfAdd()
        // setup vote settings
        workflowWfAdd[3][0].approve_threshold = voteApproveThreshold
        workflowWfAdd[3][0].quorum = voteQuorum
        workflowWfAdd[3][0].duration = voteDuration
        builder.addWorkflow(standardFncalls.map((item) => item[0]), standardFncalls.map((item) => item[1]), workflowWfAdd[1], workflowWfAdd[2], [workflowWfAdd[0]], [workflowWfAdd[3]]);
        // treasury lock
        const assetAmount = Utils.getLockDistributionAmount(ftAmount.toString(), councilSharePercent, councilSharePercentInit)
        builder.addTreasuryPartitionFt(this.t("default.council") + ' - ' + this.t("default.allocation"), ftAccountId, ftDecimals, new Decimal(assetAmount).toNumber(), councilUnlokingDuration)

        const dao = builder.create()

        const createArgs = {
            name: accountId,
            info: {
                founded_s: DateHelper.nowToSeconds(),
                name, 
                description: purpose,
                ft_name: ftAccountId,
                ft_amount: ftAmount,
                tags: []
            },
            args: ObjectHelper.toBase64(dao)
        }


        console.log(createArgs, dao)

        this.service.create(createArgs, NearUtils.toTGas(300), NearUtils.nearToYocto(10))
    }
}