<template>
   <div class="container mb-2">
      <div class="mb-7">
         <h5 class="text-start mb-4">{{t('default.governance_token')}}</h5>
         <StakingBar class="mb-3"/>
         <div class="d-flex flex-wrap gap-3 ">
            <InfoAmountCard :amount="1000" :header="t('default.my_share')" suffix="NDAO" style="width: 283px"/>
            <InfoAmountCard :amount="1000" :header="t('default.total_locked')" suffix="NDAO" style="width: 283px"/>
            <InfoAmountCard :amount="1000" :header="t('default.total_value')" suffix="USD" style="width: 283px">
               <template #icon>
                  <div class="rounded-circle me-2 fw-bold d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; box-shadow: 0px 3px 6px #0000001F;">
                     $
                  </div>
               </template>
            </InfoAmountCard>
         </div>
      </div>
      <div>
         <h5 class="text-start mb-4">{{t('default.users_to_delegate')}}</h5>
         <div class="row g-2">
            <div class="col-md-4">
               <UsersToDelegateCard accountId="mike.testnet" bio="Some text about me as a good choice for delegation of gov token." tag="Advisor" :amount="25"  />
            </div>
            <div class="col-md-4">
               <UsersToDelegateCard accountId="mike.testnet" bio="Some text about me as a good choice for delegation of gov token." tag="Advisor" :amount="25" />
            </div>           
            <div class="col-md-4">
               <UsersToDelegateCard accountId="mike.testnet" bio="Some text about me as a good choice for delegation of gov token." tag="Advisor" :amount="25"/>
            </div>
            <div class="col-md-4">
               <UsersToDelegateCard accountId="mike.testnet" bio="Some text about me as a good choice for delegation of gov token." tag="Advisor" :amount="25"/>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import StakingBar from '@/components/dao/governance/StakingBar.vue'
import InfoAmountCard from '@/components/ui/InfoAmountCard.vue'
import UsersToDelegateCard from '@/components/dao/governance/UsersToDelegateCard.vue'
export default {
    components: {
      StakingBar,
      InfoAmountCard,
      UsersToDelegateCard
    },
   setup () {
      const {t} = useI18n()

      return {
         t
      }
   }
}
</script>
