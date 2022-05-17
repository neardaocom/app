<template>
   <MDBCard>
      <MDBCardBody class="text-start">
         <h6 class="text-muted">
            {{t('default.active_proposals')}}
         </h6>

          <!-- v-for -->
         <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
               <div class="small text-muted mb-n2">Marketplace</div>
               <div>Buying Skyward</div>
            </div>
            <div>
               <div class="small mb-n1"><i class="bi bi-calendar4 text-gradient-180 "/> 2022/05/05 - 6:00PM </div>
               <MDBProgress :height="15" class="rounded">
                  <MDBProgressBar class="bg-gradient-270 rounded" :value="25" :style="1">
                     25%
                  </MDBProgressBar>
               </MDBProgress>
            </div>
         </div>


         <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
               <div class="small mb-n2 text-muted">Marketplace</div>
               <div>Buying Skyward</div>
            </div>
            <div>
               <div class="small mb-n1"><i class="bi bi-calendar4 text-gradient-180 "/> 2022/05/05 - 6:00PM </div>
               <MDBProgress :height="15" class="rounded">
                  <MDBProgressBar class="bg-gradient-270 rounded" :value="25" :style="1">
                     25%
                  </MDBProgressBar>
               </MDBProgress>
            </div>
         </div>


      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody, MDBProgress, MDBProgressBar } from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
export default {
   components:{
      MDBCard, MDBCardBody, MDBProgress, MDBProgressBar
   },
   setup () {
      const {t} = useI18n()

      return {
         t
      }
   }
}
</script>