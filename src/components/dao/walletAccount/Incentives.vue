<template>
   <MDBCard text="start">
      <MDBRow class="g-0">
         <MDBCol col="1" class="d-flex flex-column-reverse justify-content-between text-center text-white bg-gradient-180 py-4" style="border-radius: 0.5rem 0 0 0.5rem">
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
               <MDBCardText class="mb-5">
                  <div class="d-flex align-items-center">
                     <Icon icon="NEAR" :size="25"/>
                     <span><NumberFormatter class="fs-4 fw-bold me-1" :amount="1000"/><span class="fs-5 fw-bold" >NEAR</span></span>
                  </div>
                  <div class="mt-n2" style="margin-left: 33px">
                     <NumberFormatter :amount="2000000"/> <span class="text-muted small"> {{t('default.total_locked')}} </span>
                  </div>
               </MDBCardText>
               <MDBCardText>
                  <span class="text-muted small">From Lock #1</span>
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
   },
   setup () {
      const { t } = useI18n()

      return {
         t,
      }
   }
}
</script>
