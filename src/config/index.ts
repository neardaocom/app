import { AppConfig, getConfig as getConfigApp } from "./app";
import { NearConfig, NearConfigLocal, NearConfigCI, getConfig as getConfigNear } from "./near";
import { FirebaseConfig, getConfig as getConfigFirebase } from "./firebase";
import { IPFSConfig, getConfig as getConfigIPFS } from "./ipfs";
import { MarketConfig, getConfig as getConfigMarket } from "./market";

export type Config = {
    app: AppConfig,
    near: NearConfig | NearConfigLocal | NearConfigCI,
    firebase: FirebaseConfig,
    ipfs: IPFSConfig,
    market: MarketConfig,
}

export const getConfig = (env: string): Config => {
    return {
        app: getConfigApp(env),
        near: getConfigNear(env),
        firebase: getConfigFirebase(env),
        ipfs: getConfigIPFS(env),
        market: getConfigMarket(env),
    }
}