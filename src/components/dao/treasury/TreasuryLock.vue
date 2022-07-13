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
               <div class="d-flex align-items-center mb-2">
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
                           {{nextUnlockTime}}
                        </div>
                        <div class="text-muted text-end mt-n2">
                           {{nextUnlockDate}}
                        </div>
                     </div>
                  </div>
               </div>
               <MDBCardText  class="mb-5">
                  <div v-for="(asset, index) in lock.assets" :key="index">
                     <div class="d-flex align-items-center">
                        <div>
                           <div class="d-flex align-items-center">
                              <Icon :icon="asset.asset.type === 'near' ? 'near' : asset.asset.icon" :size="25"/>
                              <InfoAmount :amount="asset.unlocked" :suffix="asset.asset.symbol" suffixColor="muted" class="fs-4 fw-bold"/>    
                           </div>
                           <div class="mt-n2" style="margin-left: 33px">
                              <NumberFormatter :amount="computeUnlocked(asset)"/> <span class="text-muted small"> {{t('treasury_locked')}} </span>
                           </div>
                        </div>
                        <div v-if="asset.unlocking.length > 0" class="ms-auto">
                           <a  
                              @click="collapse[index] = !collapse[index]"
                              :aria-controls="`collapsibleContent_${index}`"
                              :aria-expanded="collapse[index]"  
                              role="button" 
                              class="text-dark text-decoration-underline ms-auto"
                           >
                              {{t('unlocking_detail')}}
                           </a>
                        </div>
                     </div>
                     <MDBCollapse v-if="asset.unlocking.length > 0" :id="`collapsibleContent_${index}`" v-model="collapse[index]">
                        <div class="mt-3">
                           <MDBChart type="bar" :data="getChart(asset)" />
                        </div>
                     </MDBCollapse>
                  </div>
               </MDBCardText>
               <MDBCardText>
                  <div class="d-flex justify-content-between">
                     <MDBBtn v-if="canUnlock" @click="unlock(lock.id)" class="m-1" color="primary" size="sm" rounded style="width: 144px">{{ t('treasury_unlock') }}</MDBBtn>
                     <a v-show="false" href="#" class="text-dark text-decoration-underline ms-auto">{{t('detail')}}</a>
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
   MDBCollapse,
   MDBChart
} from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import { ref, toRefs } from '@vue/reactivity'
import Icon from '@/components/ui/Icon.vue'
import { useTreasuryLock, useTreasuryLockAsset } from '@/hooks/treasury'
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
      InfoAmount,
      MDBCollapse,
      MDBChart
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

      const collapse = ref(new Array(lock.value.assets.length).fill(false))

      const { isUnlocked, canUnlock, computeUnlocked, nextUnlockDate, nextUnlockTime } = useTreasuryLock(lock)
      const { getChart } = useTreasuryLockAsset()

      return {
         t,
         isUnlocked, canUnlock, computeUnlocked, nextUnlockDate, nextUnlockTime, collapse,
         getChart
      }
   }
}
</script>
