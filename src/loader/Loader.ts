import Register from "@/models/utils/Register";
import { ref, Ref } from "vue";
import { AppError, InvalidInputError } from "@/models/utils/errors";
import { Config, getConfig } from "@/config"
import { UnsupportedError } from "@/models/utils/errors";

import NearBlockchainFactory from "@/models/nearBlockchain/Factory";
import DaoFactory from "@/models/dao/Factory";
import { NearConfig } from "@/config/near";

export default class Loader {
    private register: Register;
    private config: Config;

    constructor (register: Register, config: Config) {
        this.register = register;
        this.config = config;
    }

    load(key: string): Ref {
        const value = this.register.get(key)
        if (value === undefined) {
            throw new AppError("Loader has not loaded: " + key)
        }
        return ref(value)
    }

    async get(key: string): Promise<Ref> {
        if (key.length < 1) {
            throw new InvalidInputError('Key is empty');
        }

        let objectRef: Ref | undefined = this.register.get(key);

        if (objectRef === undefined) {
            switch (key) {
                case 'nearBlockchain/Factory': {
                        const factory = new NearBlockchainFactory(this.config.near as NearConfig)
                        objectRef = ref(factory)
                    }
                    break;
                case 'near/Near': {
                        // dependency
                        const nearFactory = await this.get('nearBlockchain/Factory')
                        objectRef = ref(await nearFactory.value.createNear())
                    }
                    break;
                case 'near/WalletConnection': {
                        const nearFactory = await this.get('nearBlockchain/Factory')
                        const near = await this.get('near/Near')
                        objectRef = ref(nearFactory.value.createWalletConnection(near.value))
                    }
                    break;
                case 'near/WalletAccount': {
                        const nearFactory = await this.get('nearBlockchain/Factory')
                        const walletConnection = await this.get('near/WalletConnection')
                        objectRef = nearFactory.value.createWalletAccount(walletConnection.value)
                    }
                    break;
                case 'dao/Factory': {
                        const nearNear = await this.get('near/Near')
                        const nearBlockchainFactory = await this.get('nearBlockchain/Factory')
                        const nearWalletAccount = await this.get('near/WalletAccount')
                        const factory = new DaoFactory(nearNear.value, nearWalletAccount.value, nearBlockchainFactory.value)
                        objectRef = ref (factory)
                    }
                    break;
                case 'dao/ServicePool': {
                        const daoFactory = await this.get('dao/Factory')
                        const servicePool = daoFactory.value.createServicePool()
                        objectRef = ref (servicePool)
                    }
                    break;
                default:
                    throw new UnsupportedError('Key: ' + key)
            }
            this.register.set(key, objectRef!)
            console.log('Set', key, objectRef!, this.register.getList())
        } else {
            console.log('Get', key, objectRef, this.register.getList())
        }


        return ref(objectRef!);
    }
}