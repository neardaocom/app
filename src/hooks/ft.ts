import { Config } from "@/config";
import { Loader } from "@/loader"
import FtCreate from "@/models/ft/FtCreate";
import { Ref } from "vue";
import Utils from "@/models/dao/Utils";

export const useCreateToken = (loader: Ref<Loader>, config: Ref<Config>, daoAccountId: string) => {

    const createToken = async (formData: any) => {
        const nearFactory = await loader.value.get('nearBlockchain/Factory')
        const account = await loader.value.get('near/WalletAccount')
        // console.log(account, config.value.near.ftFactoryAccountId)
        const ftCreate = new FtCreate(nearFactory.value.createFtFactoryContractService(account.value, config.value.near.ftFactoryAccountId))
        let initDistributionAmount: string | null = null;
        if (formData.ftCouncilShare > 0 && formData.dao_ft_init_distribution) {
            initDistributionAmount = Utils.getInitDistributionAmount(formData.dao_ft_amount, formData.ftCouncilShare, formData.dao_ft_init_distribution)
        }
        ftCreate.create(daoAccountId, formData.dao_ft_amount, formData.dao_ft_account, formData.dao_ft_name, initDistributionAmount, formData.council_array, formData.dao_ft_account.toUpperCase(), null)
    }

    return {
        createToken
    }
}