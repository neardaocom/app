<template>
   <MDBCard text="start" class="mb-3">
      <MDBRow class="g-0">
         <MDBCol col="2" class="d-flex flex-column justify-content-between text-center text-white" :class="colorCard" style="border-radius: 0.5rem 0 0 0.5rem">
            <div class="py-4" > 
               <i v-if="template.status ===  t('default.installed')" class="bi bi-check-circle fa-2x"/>
               <i v-else-if="template.status === t('default.buy')" class="bi bi-cart fa-2x"/>
               <i v-else class="bi bi-clock fa-2x"/>
            </div>
            <div> v{{ template.version }}.0 </div>
         </MDBCol>
         <MDBCol col="10">
            <MDBCardBody>
            <div class="text-muted">
               {{t("default.service")}}
            </div>
            <MDBCardTitle class="h4">{{ t('default.wf_templ_' + template.code) }}</MDBCardTitle>
            <MDBCardText class="mb-5">
               <small class="text-muted">
                  {{ t('default.wf_templ_' + template.code + '_description') }}
               </small>
            </MDBCardText>
            <MDBCardText>
               <div class="d-flex justify-content-between">
                  <span>{{`${t("default.created_by")} ${creator.name}` }} </span>
                  <MDBBtn rounded @click.prevent="click" class="text-white fw-bold" :class="colorButton" >
                     {{ template.status }}
                     <span v-if="template.status === t('default.buy')"> {{ getPrice(template.code) }} </span>
                  </MDBBtn>
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
   MDBBtn,
   MDBRow,
   MDBCol
} from 'mdb-vue-ui-kit'
import { useCreators } from "@/hooks/workflow";
import { computed } from '@vue/reactivity';
import { toRefs } from '@vue/reactivity'
import loGet from "lodash/get";
import { market } from "@/data/workflow";

export default {
   components: {
      MDBCard,
      MDBCardBody,
      MDBCardText,
      MDBCardTitle,
      MDBBtn,
      MDBRow,
      MDBCol
   },
   props: {
      template: {
         type: Object,
         required: true,
      },
   },

   setup (props, {emit}) {
      const {template} = toRefs(props)
      const { t, n} = useI18n()
      const { creator } = useCreators()

      const colorCard = computed(() => {
         if( template.value.status === t('default.buy')) {
            return 'bg-gradient-10'
         } else if(template.value.status === t('default.installed')) {
            return 'bg-success'
         } else {
            return 'bg-warning'
         }
      })

      const colorButton = computed(() => {
         if( template.value.status === t('default.buy')) {
            return 'bg-gradient-10'
         } else if(template.value.status === t('default.installed')) {
            return 'bg-success'
         } else {
            return 'bg-muted'
         }
      })

      const getPrice = (templateCode) => {
         const price = loGet(market, [templateCode])?.price ?? 0
         return (price == 0) ? t('default.free') : n(price) + ' N';
      }

      const click = () => {
         if(template.value.status === t('default.buy')){
            emit("btn-click", template)
         }
      }

      return {
         t,
         creator,
         colorCard,
         colorButton,
         getPrice,
         click
      }
   }
}
</script>
