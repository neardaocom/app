<template>
  <div class="row mb-4">
    <div class="col-12 col-md-7">
      <dt>{{ t("default.wf_vote_level") }}:</dt>
      <dd v-html="t('default.' + voteLevel.key, voteLevel.params)"></dd>
    </div>
  </div>

  <div class="row mb-4">
    <div class="col-12 col-md-7">
      <Select
        :labelName="t('default.wf_can_propose')"
        id="can_propose"
        multiple
        :options="proposeRights"
      />
    </div>
  </div>

  <div class="row mb-4">
    <div class="col-12 col-md-7">
      <Select
        :labelName="t('default.wf_can_vote')"
        id="can_vote"
        :options="voteRights"
      />
    </div>
  </div>

  <div class="row mb-4">
    <div class="col-12 col-md-7">
      <Select
        :labelName="t('default.wf_can_execute')"
        id="activities_rights"
        :options="activitiesRights"
      />
    </div>
  </div>
</template>

<script>
import Select from "@/components/forms/Select.vue";
import { useI18n } from "vue-i18n";
//import { useStore } from 'vuex'
import { computed, toRefs } from "@vue/reactivity";
import { useForm } from "vee-validate";
import { voteLevelToTranslate } from "@/models/dao";
import { toTranslate } from "@/models/rights";
import { DAORightsType } from "@/types/dao";
import { useNear } from "@/hooks/vuex";
import loCloneDeep from "lodash/cloneDeep";
import loSplit from "lodash/split";
//import loFind from "lodash/find";
import loFill from "lodash/fill";
import loMin from "lodash/min";
import { getRandom } from "@/utils/integer";
import moment from "moment";
import { rightAnyone } from "@/data/dao";

export default {
  components: {
    Select,
  },
  props: {
    template: {
      type: Object,
      required: true,
    },
    contractId: {
      type: String,
      required: true,
    },
    dao: {
      type: Object,
      required: true,
    },
    daoRights: {
      type: Object,
      required: true,
    },
    price: {
        type: Number,
        required: true,
    }
  },
  setup(props) {
    const { template, contractId, dao, daoRights, price } = toRefs(props);
    const { t } = useI18n();
    const { nearService } = useNear();

    //console.log('Template', template)

    const voteLevel = voteLevelToTranslate(dao.value.voteLevels[0]);
    const proposeRights = computed(() => {
      const rights = [];
      daoRights.value.forEach((right, index) => {
        if (
          right.type === DAORightsType.Anyone ||
          right.type === DAORightsType.Member ||
          right.type === DAORightsType.TokenHolder ||
          right.type === DAORightsType.Group
        ) {
          const trans = toTranslate(right, dao.value.groups);
          rights.push({
            text: t("default." + trans.key, trans.params),
            value: index,
          });
        }
      });
      return rights;
    });

    const voteRights = computed(() => {
      const rights = [];
      proposeRights.value.forEach((right) => {
        if (right.value !== DAORightsType.TokenHolder) {
          rights.push({
            ...right,
            disabled: true,
          });
        } else {
          rights.push({ ...right });
        }
      });
      return rights;
    });
    const activitiesRights = computed(() => loCloneDeep(proposeRights.value));

    const schema = computed(() => {
      return {
        can_propose: "required",
        can_vote: "required",
        activities_rights: "required",
      };
    });
    const { handleSubmit, errors } = useForm({
      validationSchema: schema,
    });


    const onSubmit = handleSubmit(
      async (values) => {
        const canProposeArray = loSplit(values.can_propose, ",");
        const canPropose = canProposeArray.map(
          (right) => daoRights.value[right]
        );
        const storageKey = `${template.value.name}-${template.value.id}-${getRandom(
          1,
          999
        )}-${moment().valueOf()}`;

        const loadTemplate = await nearService.value.providerGet(template.value.id) // TODO: try, catch
        console.log(loadTemplate)
        const numActivities = loadTemplate[0].activities.length - 1
        const activitiesRights = loFill(Array(numActivities), [daoRights.value[values.activities_rights]])

        // Bounty
        if (template.value.code === 'wf_bounty') { // TODO: Move to code
            console.log('Bounty')
            activitiesRights[0] = [rightAnyone]
        }

        const transitionsConstraints = loadTemplate[0].transitions.map(
          (trans) => {
            return trans.map(() => {
              return { transition_limit: 10, cond: null };
            });
          }
        );

        nearService.value.addWorkflow(
          contractId.value,
          0,
          transitionsConstraints, //transition_constraints,
          daoRights.value[values.can_vote],
          canPropose,
          activitiesRights,
          '',
          [{ U16: template.value.id }], //binds
          storageKey, //storage_key: string, name wokflow, id, provider, date
          dao.value.voteLevels[0].approveThreshold, // TODO: Resolve vote level
          dao.value.voteLevels[0].quorum,
          dao.value.voteLevels[0].duration.days,
          dao.value.voteLevels[0].duration.hours,
          dao.value.voteLevels[0].duration.minutes,
          "0", //depositPropose
          "0", //depositVote
          0, //depositProposeReturn
          loMin([price.value, 1.0])
        );
      },
      () => {
        console.log(errors.value);
      }
    );

    return {
      t,
      voteLevel,
      proposeRights,
      voteRights,
      activitiesRights,
      onSubmit,
    };
  },
};
</script>