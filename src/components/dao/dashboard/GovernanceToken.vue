<template>
    <div class="card text-start w-auto p-2">
        <div class="card-body">
            <h6 class="text-muted">
                {{t('default.governance_token')}}
            </h6>

            <div class="d-flex justify-content-between align-items-center mb-3">
               <MDBBadge class="text-white bg-gradient-290" style="padding: 0.6rem">{{`${dao.token_name} ${t('default.token')}`}}</MDBBadge> 
               <div class="d-flex align-items-center">
                    <slot name="icon">
                        <MDBBadge color="black" pill class="me-2" style="padding: 0.3rem;"><img width="13" height="13" :src="'/img/near_logo.svg'"/></MDBBadge>
                    </slot>
                    <div class="text-start fs-5 fw-bold">
                        <NumberFormatter class="me-1" :amount="1000000"/>NEAR
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
               <div>
                  <div>{{t('default.total_token_value')}}</div>
                  <div class="fw-bold mt-n1"><NumberFormatter class="me-1" :amount="1000000"/>N</div>
               </div>
               <div>
                    <i class="bi bi-person"/> no delegation
                </div>
            </div>
           
            <div class="float-end mt-2">
                <MDBBtn size="sm" color="primary" rounded>...</MDBBtn>
            </div>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { MDBBtn, MDBBadge } from 'mdb-vue-ui-kit'
import { inject } from '@vue/runtime-core'
import NumberFormatter from '@/components/ui/NumberFormatter.vue'

export default {
   components: {
      MDBBtn, 
      MDBBadge,
      NumberFormatter
   },
   setup() {
      const { t, n } = useI18n()
      const dao = inject('dao')

      return {
         t, n, dao
      }
   }
}
</script>
