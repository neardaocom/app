export type FungibleTokenMetadata = {
    spec: string;
    name: string;
    symbol: string;
    icon: string | null;
    reference: string | null;
    reference_hash: string | null;
    decimals: number;
}

export type Settings = {
    /// Account allowed to change these settings.
    owner_id: string;
    /// Minting new FT is allowed.
    mint_allowed: boolean;
    /// Burning FT is allowed.
    burn_allowed: boolean;
    /// Account of contract allowed to provide new version.
    /// If not set then upgrade is not allowed.
    upgrade_provider: string | null;
}

export type InitDistribution = {
    account_id: string; // valid account id
    amount: string; // numeric string
}

export type StorageBalance = {
    total: string;
    available: string;
}
export type StorageBalanceBounds = {
    min: string;
    max: string | null;
}

export type CreateToken = {
    owner_id: string;
    total_supply: string;
    metadata: FungibleTokenMetadata;
    settings: Settings | null;
    init_distribution: InitDistribution[];
}