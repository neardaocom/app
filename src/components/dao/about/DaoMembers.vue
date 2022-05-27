<template>
   <div class="card text-start w-auto p-2">
      <div class="card-body">
         <div class="d-flex mb-2">
            <h5 class="card-title">
               <i class="bi bi-people text-gradient-180 me-1"/>
               {{ t('default.members') }}
            </h5>
            <Tooltip class="ms-auto" text="Tooltip" />
         </div>

         <ul class="list-unstyled fw-bold mb-3">
            <li>
               <i class="bi bi-pie-chart text-muted me-2"/>
               {{ councilPercent || "-" }}%
               {{ t("default.council") }}
            </li>
         </ul>

         <h6 class="fw-bold">{{ t("default.council") }}</h6>
         <ul class="mt-n2 list-unstyled">
            <li v-for="(member, index) in council.members" :key="index">
               <i class="bi bi-person text-muted me-2"/> {{ member.accountId }}
            </li>
         </ul>
      </div>
   </div>
</template>

<script>
import { useGroups } from '@/hooks/dao'
import { inject } from '@vue/runtime-core'
import Tooltip from '@/components/ui//Tooltip.vue'
import { useI18n } from 'vue-i18n'
export default {
   components:{
      Tooltip
   },
   setup () {
      const dao = inject('dao')
      const { t, n } = useI18n()
      const { council, councilPercent } = useGroups(dao.value)

      return {t, n, council, councilPercent}
   }
}
</script>
