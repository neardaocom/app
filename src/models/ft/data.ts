import { FungibleTokenMetadata } from "../nearBlockchain/types/ft";

export const list: { [key: string]: FungibleTokenMetadata } = {
    'near': {
        spec: 'ft-1.0.0',
        name: 'Near',
        symbol: 'NEAR',
        icon: null,
        reference: null,
        reference_hash: null,
        decimals: 24,
    }
}

export const getMetadata = (accountId: string) => list[accountId]