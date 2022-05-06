import Staking from "@/models/nearBlockchain/Staking"
import StakingTransformer from "@/models/nearBlockchain/transformers/Staking.transformer"
import { UserInfoStaking } from "@/models/nearBlockchain/types/staking"
import { inject, onMounted, Ref, ref } from "vue"
import { useI18n } from "vue-i18n"

export const useUserInfo = (daoId: string, accountId: string, staking: Staking) => {
   const { t, n } = useI18n()
   const logger: any = inject('logger')
   const notify: any = inject('notify')
   const userInfo = ref<UserInfoStaking | undefined>()

   onMounted( async () => {
      try {
         const stakingTransformer = new StakingTransformer()
         userInfo.value = await staking.daoGetUser(daoId, accountId, stakingTransformer )

      } catch (e) {
         logger.error('D', '', 'LoadStakingUserInfo', 'Loading staking user info')
         logger.error('B', '', 'LoadStakingUserInfo', 'Loading staking user info')
         //TODO: warning
         notify.warning('Loading staking user info faild')
         notify.flush()
         console.log(e)
      }
   })
   return{ userInfo }
}