<template>
   <div class="container mb-2">
      <div class="mb-7">
         <h5 class="text-start mb-4">{{t('default.governance_token')}}</h5>
         <StakingBar class="mb-3"/>
         <div class="d-flex flex-wrap gap-3 ">
            <InfoAmount v-if="dao.staking.userInfo" :amount="dao.staking.userInfo.staked" :header="t('default.my_share')" :suffix="dao.treasury.token.meta.short" :icon="dao.treasury.token.meta.short?.img" style="width: 283px"/>
            <InfoAmount :amount="dao.staking.totalStaked" :header="t('default.total_locked')" :suffix="dao.treasury.token.meta.short" :icon="dao.treasury.token.meta.short?.img" style="width: 283px"/>
         </div>
      </div>
      <div>
         <h5 class="text-start mb-4">{{t('default.users_to_delegate')}}</h5>
         <div class="row g-2">
            <div v-for="user in dao.staking.usersToDelegate" :key="user.id" class="col-md-4">
               <UsersToDelegate :accountId="user.accountId" :bio="user.bio" :tag="user.tag" :amount="user.votesCasted"/>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import StakingBar from '@/components/dao/governance/StakingBar.vue'
import InfoAmount from '@/components/ui/InfoAmount.vue'
import UsersToDelegate from '@/components/dao/governance/UserToDelegate.vue'
import { inject } from '@vue/runtime-core'
export default {
    components: {
      StakingBar,
      InfoAmount,
      UsersToDelegate
    },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')

      return {
         t,
         dao
      }
   }
}
</script>
