<template>
  <div class="container mb-2">
    <div class="card mb-3">
      <div class="card-body text-start">
        <h3>{{ t('default.workflows')}} & {{ t('default.rights')}}</h3>
        <SettingsTable :settings="data"/>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n"
//import { useRights } from "@/hooks/dao";
import { inject } from 'vue';
import loOrderBy from "lodash/orderBy"
import SettingsTable from '@/components/dao/settings/SettingsTable.vue'

export default {
  components:{
    SettingsTable
  },
  
  setup() {
    const dao = inject('dao')
    const { t } = useI18n();

    const data = loOrderBy(dao.value.templates, ['id'], ['desc'])

    //const { daoRights, daoRightsOptions } = useRights(dao.value);

    return { dao, t, data };
  },
};
</script>