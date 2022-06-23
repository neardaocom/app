<template>
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
      <tr v-for="template in settings" :key="template.id">
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
</template>

<script>
import ProposalHelper from "@/models/dao/ProposalHelper"
import Rights from "@/models/dao/Rights";
import WorkflowHelper from "@/models/dao/WorkflowHelper";
import { useI18n } from 'vue-i18n';
import { inject } from '@vue/runtime-core';

export default {
   props:{
      settings:{
         type: Object,
         required: true,
      }
   },
   setup () {
      const dao = inject('dao')
      const { t } = useI18n()

      const transVoteLevel = (voteLevel) => {
         const trans = ProposalHelper.voteLevelToTranslate(voteLevel)
         return t('default.' + trans.key, trans.params)
      }
      const transSettingsConstants = (template, settingsId) => {
         const trans = WorkflowHelper.settingsConstantsToTranslate(template, settingsId)
         return t('default.' + trans.key, trans.params)
      }
      const trans = (right) => {
         const trans = Rights.toTranslate(right, dao.value.groups)
         return t('default.' + trans.key, trans.params)
      }
      const activityName = (template, activitiId) => {
         return WorkflowHelper.getActivityById(template, activitiId)?.name
      }
      const activityRights = (settings, activity) => {
         return WorkflowHelper.getActivityRights(settings, activity)
      }

      return {
         t, transVoteLevel, transSettingsConstants, trans, activityName, activityRights 
      }
   }
}
</script>