<template>
   <div class="card text-start w-auto p-2">
      <div class="card-body">
      <h5 class="card-title">
         <i class="bi bi-people text-gradient-180 me-1"/>
         {{ t('default.members') }}
      </h5>
      <ul class="list-unstyled mb-2">
         <li>
            <i class="bi bi-pie-chart me-1"/>
            {{ councilPercent || "-" }}%
            {{ t("default.council") }}
         </li>
      </ul>
      <h6>{{ t("default.council") }}</h6>
      <ul class="mt-n2 list-unstyled">
         <li v-for="(member, index) in council.members" :key="index" class="ms-2">{{ member.accountId }}</li>
      </ul>
      </div>
   </div>
</template>

<script>
import { useGroups } from '@/hooks/dao'
import { inject } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
export default {
   setup () {
      const dao = inject('dao')
      const { t, n } = useI18n()
      const { council, councilPercent } = useGroups(dao.value)

      return {t, n, council, councilPercent}
   }
}
</script>
