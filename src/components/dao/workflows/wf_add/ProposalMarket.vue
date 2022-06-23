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
import { inject } from "vue";
//import { useStore } from 'vuex'
import { computed, toRefs } from "@vue/reactivity";
import { useForm } from "vee-validate";
import ProposalHelper from "@/models/dao/ProposalHelper"
import Rights from "@/models/dao/Rights";
import { DAORightsType } from "@/models/dao/types/dao";
//import { useNear } from "@/hooks/vuex";
import loCloneDeep from "lodash/cloneDeep";
import loSplit from "lodash/split";
//import loFind from "lodash/find";
import loMax from "lodash/max";
import { useMarket } from '@/hooks/market';

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
    const loader = inject('loader')
    const config = inject('config')

    console.log(contractId)

    const { market } = useMarket(loader, config)

    // const { nearService } = useNear();
    //console.log('Template', template)

    const voteLevel = ProposalHelper.voteLevelToTranslate(dao.value.voteLevels[0]);
    const proposeRights = computed(() => {
      const rights = [];
      daoRights.value.forEach((right, index) => {
        if (
          right.type === DAORightsType.Anyone ||
          right.type === DAORightsType.Member ||
          right.type === DAORightsType.TokenHolder ||
          right.type === DAORightsType.Group
        ) {
          const trans = Rights.toTranslate(right, dao.value.groups);
          rights.push({
            text: t("default." + trans.key, trans.params),
            value: index,
            type: right.type,
          });
        }
      });
      return rights;
    });

    const voteRights = computed(() => {
      const rights = [];
      proposeRights.value.forEach((right) => {
        if (right.type !== DAORightsType.TokenHolder) {
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

        market.value.install(dao.value, template.value.id, canPropose, daoRights.value[values.can_vote], {}, [daoRights.value[values.activities_rights]], loMax([price.value, 1.0]))
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
      market,
    };
  },
};
</script>