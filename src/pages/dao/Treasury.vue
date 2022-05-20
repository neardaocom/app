<template>
   <div class="container mb-4">
      <div class="mb-7">
         <h5 class="text-start mb-4">{{t('default.total_dao_locked_value')}}</h5>
         <div class="d-flex flex-wrap gap-3">
           <InfoAmount
          :amount="1000" suffix="USD" style="min-width: 283px">
               <template #icon>
                  <div class="rounded-circle me-2 fw-bold d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; box-shadow: 0px 3px 6px #0000001F;">
                     $
                  </div>
               </template>
            </InfoAmount
         >
            <InfoAmount
          :amount="4000" suffix="NEAR" style="min-width: 283px"/>
            <InfoAmount
          :amount="20000000" suffix="NDAO" style="min-width: 283px"/>
            
         </div>
      </div>
      
      <div>
        <div class="d-flex mb-4">
          <h5 class="text-start me-auto">{{t('default.locks')}}</h5>
          <MDBBtn color="primary" size="sm" rounded class="align-self-center" style="width: 144px">{{t('default.payout')}}</MDBBtn>
        </div>
         
         <div class="row g-3">
            <div class="col-md-6">
               <Locks/>
            </div>
            <div class="col-md-6">
               <Locks />
            </div>           
            <div class="col-md-6">
               <Locks/>
            </div>
            <div class="col-md-6">
               <Locks/>
            </div>
         </div>
      </div>
   </div>

   <!-- <ModalTreasuryLocks/> -->
</template>

<script>
import { useI18n } from 'vue-i18n'
import InfoAmount from '@/components/ui/InfoAmount.vue'
import Locks from '@/components/dao/treasury/Lock.vue'
// import ModalTreasuryLocks from '@/pages/dao/modals/ModalTreasuryLocks.vue'
import { MDBBtn } from "mdb-vue-ui-kit";
export default {
    components: {
      InfoAmount
   ,
      Locks,
      // ModalTreasuryLocks,
      MDBBtn 
    },
   setup () {
      const {t} = useI18n()

      return {
         t
      }
   }
}
</script>
