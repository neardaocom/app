<template>
  <div class="container mb-2">
    <div class="card mb-3">
      <div class="card-body text-start">
        <h3>{{ t('default.workflows')}} & {{ t('default.rights')}}</h3>
        <table class="table">
          <thead>
            <tr>
              <th>{{ t('default.workflow') }}</th>
              <th>{{ t('default.wf_vote_level') }}</th>
              <th>{{ t('default.wf_can_propose') }}</th>
              <th>{{ t('default.wf_can_vote') }}</th>
              <th>{{ t('default.wf_can_execute') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="template in data" :key="template.id">
              <template v-for="settings in template.settings" :key="settings.id">
                <td>
                  <span class="fw-bold">{{ t('default.wf_templ_' + template.code) }}</span><br/><span>{{ transSettingsConstants(template, settings.id) }}</span>
                </td>
                <td><span v-html="transVoteLevel(settings.voteLevel)"></span></td>
                <td>
                  <template v-for="(right, index) in settings.proposeRights" :key="index">
                    <span v-if="index > 0"> | </span>{{ trans(right) }}
                  </template>
                </td>
                <td>{{ trans(settings.voteRight) }}</td>
                <td>
                  <template v-for="(activity, index) in template.activities" :key="index">
                    {{ t('default.wf_templ_' + template.code + '__' + activity.code) }}:
                    <template v-for="(right, index) in activityRights(settings, activity)" :key="index">
                      <span v-if="index > 0"> | </span>{{ trans(right) }}
                    </template>
                    <br/>
                  </template>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// import { MDBInput, MDBIcon, MDBSelect } from "mdb-vue-ui-kit";
//import { reactive } from "@vue/reactivity"
import { useI18n } from "vue-i18n"
import { useRights } from "@/hooks/dao";
import { voteLevelToTranslate } from "@/models/dao"
import Rights from "@/models/dao/Rights";
import { getActivityById, settingsConstantsToTranslate, getActivityRights } from "@/models/workflow";
import { toRefs } from 'vue';
//import { payoutAtStart, payoutAfterPayNear, payoutFinished } from "@/data/workflow"
//import Workflow from "./Workflow.vue"
import loOrderBy from "lodash/orderBy"

export default {
  components: {
    // MDBInput, MDBIcon, MDBSelect, Workflow
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { dao } = toRefs(props)
    const { t } = useI18n();

    const data = loOrderBy(dao.value.templates, ['id'], ['desc'])

    const { daoRights, daoRightsOptions } = useRights(dao.value);

    return { t, daoRights, daoRightsOptions, data };
  },
  methods: {
    transVoteLevel(voteLevel) {
      const trans = voteLevelToTranslate(voteLevel)
      return this.t('default.' + trans.key, trans.params)
    },
    transSettingsConstants(template, settingsId) {
      const trans = settingsConstantsToTranslate(template, settingsId)
      return this.t('default.' + trans.key, trans.params)
    },
    trans(right) {
      const trans = Rights.toTranslate(right, this.dao.groups)
      return this.t('default.' + trans.key, trans.params)
    },
    activityName(template, activitiId) {
      return getActivityById(template, activitiId)?.name
    },
    activityRights(settings, activity) {
      return getActivityRights(settings, activity)
    }
  }
};
</script>