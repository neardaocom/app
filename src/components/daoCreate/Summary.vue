<template>
  <div class="row">
    <div class="col-6">
      <dl class="row">
        <FormSummary :name="t('dao_name')" :value="values.dao_name" />

        <FormSummary :name="t('account')" :value="daoAccountId" />

        <FormSummary
          :name="t('purpose_short')"
          :value="values.dao_purpose"
        />

        <FormSummary
          :name="t('type')"
          :value="t('' + values.dao_type)"
        />

        <FormSummary
          :name="t('founders')"
          :value="values.council_array.join(', ')"
        />
      </dl>
    </div>
  </div>

  <div class="row">
    <div class="col-md-6">
      <h5 class="text-muted">{{ t("governance_tokens") }}</h5>
      <hr />
      <dl class="row">
        <FormSummary
          :name="t('dao_ft_name')"
          :value="values.dao_ft_name"
        />

        <FormSummary :name="t('account')" :value="ftAccountId" />

        <FormSummary
          :name="t('amount')"
          :value="values.dao_ft_amount"
        />

        <FormSummary
          :name="t('founders_unlock')"
          :value="(values.ftCouncilShare ? values.ftCouncilShare : '0') + '%'"
        />

        <FormSummary
          :name="t('dao_ft_init_distribution')"
          :value="
            (values.dao_ft_init_distribution
              ? values.dao_ft_init_distribution
              : '0') + '%'
          "
        />

        <FormSummary
          :name="t('lenght_founders_vesting')"
          :value="unlockingTime"
        />

        <FormSummary
          :name="t('community_fund')"
          :value="(values.ftCommunityShare ? values.ftCommunityShare : '0') + '%'"
        />
      </dl>
    </div>

    <div class="col-md-6">
      <h5 class="text-muted">{{ t("voting") }}</h5>
      <hr />
      <dl class="row">
        <FormSummary
          :name="t('dao_vote_approve_threshold')"
          :value="(values.voteApproveThreshold ? values.voteApproveThreshold : '0') + '%'"
        />

        <FormSummary
          :name="t('dao_vote_quorum')"
          :value="values.voteQuorum ? values.voteQuorum : '0' + '%'"
        />

        <FormSummary
          :name="t('dao_vote_duration_days')"
          :value="values.voteDurationDays"
        />

        <FormSummary
          :name="t('dao_vote_duration_hours')"
          :value="values.voteDurationHours"
        />

        <FormSummary
          :name="t('dao_vote_duration_minutes')"
          :value="values.voteDurationMinutes"
        />
      </dl>
    </div>
  </div>
</template>

<script>
import FormSummary from "@/components/forms/FormSummary.vue";
import { useI18n } from "vue-i18n";
import { computed, toRefs, inject } from "vue";
import { useAccounts } from "@/hooks/createDao";

export default {
  components: {
    FormSummary,
  },
  props: {
    values: {
      type: Object,
      require: true,
    },
  },
  setup(props) {
    const { values } = toRefs(props);
    const { t } = useI18n();
    const config = inject("config");
    const { adminAccountId, ftFactoryAccountId, daoAccountId, ftAccountId } = useAccounts(config, values)

    const unlockingTime = computed(() => `${values.value.dao_unlocking_year ? `${values.value.dao_unlocking_year}  ${t('year')} ` : ''}${values.value.dao_unlocking_month > 0 ? `${values.value.dao_unlocking_month} ${t('month')}`: ''}`)

    return {
      t,
      adminAccountId,
      ftFactoryAccountId,
      daoAccountId,
      ftAccountId,
      unlockingTime,
    };
  },
};
</script>