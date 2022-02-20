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
        :labelName="t('default.wf_activities_rights')"
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
import { useTemplateList } from "@/hooks/workflow";
import { onMounted, watch } from "@vue/runtime-core";
import loDifferenceBy from "lodash/differenceBy";
import { useNear } from "@/hooks/vuex";
import loCloneDeep from "lodash/cloneDeep";
import loSplit from "lodash/split";
//import loFind from "lodash/find";
import loFill from "lodash/fill";
import { getRandom } from "@/utils/integer";
import moment from "moment";

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
    const { template, contractId, dao, daoRights } = toRefs(props);
    const { t } = useI18n();
    const { nearService } = useNear();

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
    const { handleSubmit, errors, setFieldTouched } = useForm({
      validationSchema: schema,
    });

    // fetch template list
    const { fetch, dataResults } = useTemplateList();
    onMounted(() => {
      fetch();
    });
    watch(
      () => [dataResults.value],
      () => {
        const workflows = loDifferenceBy(
          dataResults.value,
          dao.value.templates,
          "code"
        );
        console.log(workflows);
        console.log(dataResults.value);
        setFieldTouched("workflow", false);
      }
    );

    const onSubmit = handleSubmit(
      async (values) => {
        const canProposeArray = loSplit(values.can_propose, ",");
        const canPropose = canProposeArray.map(
          (right) => daoRights.value[right]
        );
        const storageKey = `${this.template.value.name}-${this.template.value.id}-${getRandom(
          1,
          999
        )}-${moment().valueOf()}`;

        // load templete, to count number of activities
        const loadTemplate = await nearService.value.providerGet(
          this.template.value.id
        ); // TODO: try, catch

        const numActivities = loadTemplate[0].activities.length - 1;
        const activitiesRights = loFill(Array(numActivities), [
          daoRights.value[values.activities_rights],
        ]);
        const transitionsConstraints = loadTemplate[0].transitions.map(
          (trans) => {
            return trans.map(() => {
              return { transition_limit: 10, cond: null };
            });
          }
        );

        nearService.value.addWorkflow(
          contractId.value,
          template.value.settings[0].id,
          transitionsConstraints, //transition_constraints,
          daoRights.value[values.can_vote],
          canPropose,
          activitiesRights,
          [{ U16: this.template.value.id }], //binds
          storageKey, //storage_key: string, name wokflow, id, provider, date
          dao.value.voteLevels[0].approveThreshold, // TODO: Resolve vote level
          dao.value.voteLevels[0].quorum,
          dao.value.voteLevels[0].duration.days,
          dao.value.voteLevels[0].duration.hours,
          dao.value.voteLevels[0].duration.minutes,
          "0", //depositPropose
          "0", //depositVote
          0, //depositProposeReturn
          this.price.value
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