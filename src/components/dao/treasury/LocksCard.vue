<template>
   <MDBCard text="start">
      <MDBRow class="g-0">
         <MDBCol col="1" class="d-flex flex-column justify-content-between text-center text-white bg-danger py-4" style="border-radius: 0.5rem 0 0 0.5rem">
            <div > 
               <i class="bi bi-lock fa-2x"/>
               <i v-if="false" class="bi bi-unlock fa-2x"/>
            </div>
            <div>#1</div>
         </MDBCol>
         <MDBCol col="11">
            <MDBCardBody>
               <div class="d-flex">
                  <div>
                     <small class="text-muted">
                        {{t("default.salary")}}
                     </small>
                     <MDBCardTitle class="fw-bold"> Weekly salary for council </MDBCardTitle>
                  </div>
                  <div class="d-flex align-items-center ms-auto">
                     <MDBBadge color="muted" pill class="me-2" style="padding: 0.3rem" ><i class="bi bi-unlock"/></MDBBadge>
                     <div>
                        <div class="fw-bold">
                           11:30am <small class="fw-normal">UTC</small>
                        </div>
                        <div class="text-muted text-end mt-n2">
                           2022/05/08
                        </div>
                     </div>
                  </div>
               </div>
               <MDBCardText class="d-flex mb-5">
                   <MDBBadge color="black" pill class="me-2 mt-2" style="padding: 0.3rem; width:25px; height:25px;"><img width="12" height="12" :src="'/img/near_logo.svg'" /></MDBBadge>
                   <span>
                     <span class="fs-4 fw-800" ><NumberFormatter :amount="1000"/></span><span class="h5 ps-1">NEAR</span>
                     <div class="mt-n2">
                        <NumberFormatter :amount="2000000"/> NEAR <span class="text-muted small"> total locked </span>
                     </div>
                  </span>
               </MDBCardText>
               <MDBCardText>
                  <div class="d-flex justify-content-between">
                     <span class="text-muted">Locked by filla.testnet</span>
                     <a href="#" class="text-dark text-decoration-underline">{{t('default.detail')}}</a>
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
   },
   setup () {
      const { t } = useI18n()

      return {
         t,
      }
   }
}
</script>
