import Decimal from "decimal.js";
import FtBuilder from "./FtBuilder";
import FtFactoryContractService from "../nearBlockchain/FtFactoryContractService";
import NearUtils from "../nearBlockchain/Utils";
import ObjectHelper from "../utils/ObjectHelper";

export default class FtCreate {
    private service: FtFactoryContractService;

    constructor(service: FtFactoryContractService) {
        this.service = service
    }

    async create(ownerId: string, totalSupply: string, tokenId: string, name: string, initDistributionAmount: string | null, initDistributionAccountIds: string[], symbol: string, icon: string|null) {
        // build token
        const builder = new FtBuilder()
        builder.addOwner(ownerId)
        builder.addTotalSupply(NearUtils.amountToDecimals(totalSupply, 24))
        builder.addName(name)
        builder.addSymbol(symbol)
        if (icon !== null) {
            builder.addIcon(icon)
        }

        if (initDistributionAccountIds.length > 0 && initDistributionAmount !== null) {
            const initAmountToAccount = NearUtils.amountToDecimals(new Decimal(initDistributionAmount).div(initDistributionAccountIds.length).toFixed(0), 24)
            initDistributionAccountIds.forEach((accountId) => {
                builder.addInitDistribution(accountId, initAmountToAccount)
            })
        }

        const token = builder.createToken()

        console.log(token)

        this.service.create(tokenId, ObjectHelper.toBase64(token), NearUtils.toTGas(100), NearUtils.nearToYocto(2.5))
    }
}