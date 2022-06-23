<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-5 mb-4">
        <DaoInformation/>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <DaoMembers/>
      </div>
      <div class="col-12 mb-4">
        <CommisionSystem/>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { inject } from "vue"
import DaoInformation from "@/components/dao/about/DaoInformation.vue"
import DaoMembers from "@/components/dao/about/DaoMembers.vue"
import { useGroups } from '@/hooks/dao';
import CommisionSystem from '@/components/dao/about/CommisionSystem.vue'

export default {
  components: {
    DaoInformation,
    DaoMembers,
    CommisionSystem
  },

  setup() {
    const dao = inject('dao')
    const { t, n } = useI18n()

    const { council } = useGroups(dao)

    return { dao, t, n, council };
  },
};
</script>