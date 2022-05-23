import { FTMeta } from "@/types/ft";
import find from "lodash/find";

export const list: FTMeta[] = [
    {name: 'Wrapped NEAR', symbol: 'wNEAR', icon: 'img/ft/wNear.svg', accountId: 'wrap.testnet'},
]

export const getMeta = (accountId: string): FTMeta | undefined => find(list, {'accountId': accountId});