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
                  <div v-for="(asset, index) in lock.assets" :key="index" class="d-flex">
                     <MDBBadge v-if="asset.asset.symbol==='NEAR'" color="black" pill class="me-2 mt-2" style="padding: 0.3rem"><img width="12" height="12" :src="'/img/near_logo.svg'"/></MDBBadge>
                     <div v-else-if="!asset.asset.icon" class="rounded-circle bg-black d-inline-block border border-secondary me-2" style="height:25px; width:25px"/>
                     <img v-else :src="asset.asset.icon" class="img-fluid rounded-circle border border-secondary me-2" alt="" style="height:25px; width:25px"/>
                     <span>
                        <span class="fs-4 fw-800" ><NumberFormatter :amount="asset.unlocked"/></span><span class="h6 ps-1">{{asset.asset.symbol}}</span>
                        <div class="mt-n2">
                           <NumberFormatter :amount="asset.totalLocked"/> <span class="text-muted small"> {{t('default.total_locked')}} </span>
                        </div>
                     </span>
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

export default {
   components: {
      MDBCard,
      MDBCardBody,
      MDBCardText,
      MDBCardTitle,
      MDBBadge,
      MDBRow,
      MDBCol,
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
