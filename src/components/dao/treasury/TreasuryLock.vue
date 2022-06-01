<template>
   <MDBCard text="start">
      <MDBRow class="g-0">
         <MDBCol col="1" 
            :class="isUnlocked ? 'bg-success' : 'bg-danger'" 
            class="d-flex flex-column justify-content-between text-center text-white py-4" 
            style="border-radius: 0.5rem 0 0 0.5rem"
         >
            <div > 
               <i v-if="!isUnlocked" class="bi bi-lock fa-2x"/>
               <i v-else class="bi bi-unlock fa-2x"/>
            </div>
            <div>#{{lock.id}}</div>
         </MDBCol>
         <MDBCol col="11">
            <MDBCardBody>
               <div class="d-flex">
                  <div>
                     <small class="text-muted">
                        {{lock.category}}
                     </small>
                     <MDBCardTitle class="fw-bold"> {{lock.name}} </MDBCardTitle>
                  </div>
                  <div v-if="lock.nextUnlock" class="d-flex align-items-center ms-auto">
                     <MDBBadge color="muted" pill class="me-2" style="padding: 0.3rem" ><i class="bi bi-unlock"/></MDBBadge>
                     <div>
                        <div class="fw-bold">
                           {{lock.nextUnlock?.getUTCHours()}}:{{lock.nextUnlock?.getUTCMinutes()}} <small class="fw-normal">UTC</small>
                        </div>
                        <div class="text-muted text-end mt-n2">
                           {{lock.nextUnlock?.getUTCMonth()}}/{{lock.nextUnlock?.getUTCDate()}}/{{lock.nextUnlock?.getUTCFullYear()}}
                        </div>
                     </div>
                  </div>
               </div>
               <MDBCardText  class="mb-5">
                  <div v-for="(asset, index) in lock.assets" :key="index">
                     <div class="d-flex align-items-center">
                        <Icon :icon="asset.asset.type === 'near' ? 'near' : asset.asset.icon" :size="25"/>
                        <InfoAmount :amount="asset.unlocked" :suffix="asset.asset.symbol" class="fs-4 fw-bold"/>    
                     </div>
                     <div class="mt-n2" style="margin-left: 33px">
                        <NumberFormatter :amount="computeUnlocked(asset)"/> <span class="text-muted small"> {{t('default.treasury_locked')}} </span>
                     </div>
                  </div>
               </MDBCardText>
               <MDBCardText>
                  <div class="d-flex justify-content-between">
                     <MDBBtn v-if="canUnlock" @click="unlock(lock.id)" class="m-1" color="primary" size="sm" rounded style="width: 144px">{{ t('default.treasury_unlock') }}</MDBBtn>
                     <a href="#" class="text-dark text-decoration-underline ms-auto">{{t('default.detail')}}</a>
                  </div>
                  
               </MDBCardText>
            </MDBCardBody>
         </MDBCol>
      </MDBRow>
   </MDBCard>
</template>

<script>
import { useI18n } from 'vue-i18n'
import {
   MDBCard,
   MDBCardBody,
   MDBCardText,
   MDBCardTitle,
   MDBBadge,
   MDBRow,
   MDBCol,
   MDBBtn,
} from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import { toRefs } from '@vue/reactivity'
import Icon from '@/components/ui/Icon.vue'
import { useTreasuryLock } from '@/hooks/treasury'
import InfoAmount from '@/components/ui/InfoAmount.vue'

export default {
   components: {
      MDBCard,
      MDBCardBody,
      MDBCardText,
      MDBCardTitle,
      MDBBadge,
      MDBRow,
      MDBCol,
      Icon,
      MDBBtn,
      NumberFormatter,
      InfoAmount
   },
   props: {
      lock:{
         type: Object,
         required: true
      },
      unlock: {
         type: Function,
         required: true
      }
   },
   setup (props) {
      const { t } = useI18n()
      const {lock} = toRefs(props)
      
      const { isUnlocked, canUnlock, computeUnlocked } = useTreasuryLock(lock)

      return {
         t,
         isUnlocked, canUnlock, computeUnlocked
      }
   }
}
</script>
