import { CreateToken, InitDistribution } from "../nearBlockchain/types/ft";

export default class FtBuilder {
    private ownerId?: string;
    private totalSupply?: string;
    private name?: string;
    private symbol?: string;
    private icon: string|null = null;
    private reference: string|null = null;
    private referenceHash: string|null = null;
    private canMint: boolean = false;
    private canBurn: boolean = false;
    private provider: string|null = null;
    private decimals: number = 24;
    private initDistribution: InitDistribution[] = []

    constructor() {
    }

    addOwner(accountId: string) {
        this.ownerId = accountId
    }

    addTotalSupply(amount: string) {
        this.totalSupply = amount
    }

    addName(name: string) {
        this.name = name
    }

    addSymbol(symbol: string) {
        this.symbol = symbol
    }

    addIcon(icon: string) {
        this.icon = icon
    }

    addDecimals(decimals: number) {
        this.decimals = decimals
    }

    addInitDistribution(accountId: string, amount: string) {
        this.initDistribution.push({account_id: accountId, amount: amount})
    }

    addCanMint(canMint: boolean) {
        this.canMint = canMint
    }

    addCanBurn(canBurn: boolean) {
        this.canBurn = canBurn
    }

    create(): CreateToken {
        if (this.ownerId === undefined) {
            throw new Error("Owner is not defined");
        }

        if (this.totalSupply === undefined) {
            throw new Error(" Total supply is not defined");
        }

        if (this.name === undefined) {
            throw new Error(" Total supply is not defined");
        }

        if (this.symbol === undefined) {
            throw new Error("Symbol is not defined");
        }


        return {
            owner_id: this.ownerId,
            total_supply: this.totalSupply,
            metadata: {
                spec: 'ft-1.0.0',
                name: this.name,
                symbol: this.symbol,
                icon: this.icon,
                reference: this.reference,
                reference_hash: this.referenceHash,
                decimals: this.decimals,
            },
            settings: {
                owner_id: this.ownerId,
                mint_allowed: this.canMint,
                burn_allowed: this.canBurn,
                upgrade_provider: this.provider,
            },
            init_distribution: this.initDistribution,
        };
    }

}