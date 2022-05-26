<template>
   <MDBCard text="start">
      <MDBRow class="g-0">
         <MDBCol col="1" 
            :class="unlocked ? 'bg-success' : 'bg-danger'" 
            class="d-flex flex-column justify-content-between text-center text-white py-4" 
            style="border-radius: 0.5rem 0 0 0.5rem"
         >
            <div > 
               <i v-if="!unlocked" class="bi bi-lock fa-2x"/>
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
                  <div class="d-flex align-items-center ms-auto">
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
                        <Icon v-if="asset.asset.symbol==='NEAR'" icon="NEAR" :size="25"/>
                        <Icon v-else :icon="asset.asset.icon" :size="25"/>
                        <span><NumberFormatter class="fs-4 fw-bold me-1" :amount="asset.unlocked"/><span class="fs-5 fw-bold" >{{asset.asset.symbol}}</span></span>
                     </div>
                     <div class="mt-n2" style="margin-left: 33px">
                        <NumberFormatter :amount="asset.totalLocked"/> <span class="text-muted small"> {{t('default.total_locked')}} </span>
                     </div>
                  </div>
               </MDBCardText>
               <MDBCardText>
                  <div class="d-flex justify-content-between">
                     <!-- <span class="text-muted">Locked by filla.testnet</span> -->
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
   MDBCol
} from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import { computed, toRefs } from '@vue/reactivity'
import Icon from '@/components/ui/Icon.vue'

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
      NumberFormatter
   },
   props: {
      lock:{
         type: Object,
         required: true
      }
   },
   setup (props) {
      const { t } = useI18n()
      const {lock} = toRefs(props)
      const unlocked = computed(() => Date.now() > lock.value.nextUnlock?.getTime())

      return {
         t,
         unlocked
      }
   }
}
</script>
