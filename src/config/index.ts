import { AppConfig, getConfig as getConfigApp } from "./app";
import { NearConfig, NearConfigLocal, NearConfigCI, getConfig as getConfigNear } from "./near";
import { FirebaseConfig, getConfig as getConfigFirebase } from "./firebase";
import { IPFSConfig, getConfig as getConfigIPFS } from "./ipfs";
import { MarketConfig, getConfig as getConfigMarket } from "./market";
import { BlockchainConfig, getConfig as getConfigBlockchain } from "./blockchain";

export type Config = {
    app: AppConfig,
    blockchain: BlockchainConfig,
    firebase: FirebaseConfig,
    ipfs: IPFSConfig,
    market: MarketConfig,
    near: NearConfig | NearConfigLocal | NearConfigCI,
}

export const getConfig = (env: string): Config => {
    return {
        app: getConfigApp(env),
        blockchain: getConfigBlockchain(env),
        firebase: getConfigFirebase(env),
        ipfs: getConfigIPFS(env),
        market: getConfigMarket(env),
        near: getConfigNear(env),
    }
}