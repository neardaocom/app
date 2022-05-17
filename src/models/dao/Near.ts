import loSet from "lodash/set";
import Decimal from "decimal.js";
import ServicePool from "./ServicePool";
import NearUtils from "../nearBlockchain/Utils";

export default class Near {
    private pool: ServicePool;

    constructor(pool: ServicePool) {
        this.pool = pool;
    }

    async getAccountsAmount(contractIds: string[]) {
        const result: {[index: string]: any} = {}

        const promises: any[] = []

        for (let i = 0; i < contractIds.length; i++) {
            const account = await this.pool.getAccount(contractIds[i]);
            promises.push(account.getState())
        }
        //console.log(promises)
        const states = await Promise.all(promises).catch((e) => {
          console.log(e)
        });
        // console.log(states)
    
        contractIds.forEach((contractId: string, index: number) => {
          const amountYokto = new Decimal(states[index].amount)
          loSet(result, [index], amountYokto.div(NearUtils.yoctoNear).toFixed(2))
        })
    
        return result
      }
}