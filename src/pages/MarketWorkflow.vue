<template>
  <Header></Header>
  <main>
    <MDBContainer v-if="template">
      <Breadcrumb :template="template" />
    </MDBContainer>
    <MDBContainer v-if="template">
      <MDBCard>
        <MDBCardBody>
          <MDBCardText>
            <h2>{{ template.name }}</h2>
            <hr/>
            <div class="row text-start">
              <div class="col-md-6">
                <dl class="row">
                  <dd class="col-4">ID:</dd>
                  <dt class="col-6">#{{ template.id }}</dt>

                  <dd class="col-4">{{ t('default.version') }}:</dd>
                  <dt class="col-6">v{{ template.version }}</dt>

                  <dd class="col-4 col-md-4">{{ t('default.creator') }}:</dd>
                  <dt class="col-6 col-md-6">{{ creator.name }}</dt>

                  <dd class="col-4 col-md-4">{{ t('default.workflows_start') }}:</dd>
                  <dt class="col-6 col-md-6">
                    <template v-for="(activity, index) in startActivities" :key="activity.id">
                      <span v-if="index > 0"> | </span>{{ activity.name }}
                    </template>
                  </dt>

                  <dd class="col-4 col-md-4">{{ t('default.workflows_finish') }}:</dd>
                  <dt class="col-6 col-md-6">
                    <template v-for="(activity, index) in endActivities" :key="activity.id">
                      <span v-if="index > 0"> | </span>{{ activity.name }}
                    </template>
                  </dt>
                </dl>
              </div>
              <div class="col-md-6">
                <dl class="row">
                  <template v-for="(constant, index) in template.constants" :key="index">
                    <dd class="col-4 col-md-4" :class="[index == 0 ? 'mb-0' : '']"><span v-if="index == 0">{{ t('default.wf_constants') }}:</span></dd>
                    <dt class="col-6 col-md-6">{{ constant.name }}</dt>
                  </template>

                  <template v-for="(input, index) in template.attributes" :key="index">
                    <dd class="col-4 col-md-4" :class="[index == 0 ? 'mt-4 mb-0' : '']"><span v-if="index == 0">{{ t('default.wf_inputs') }}:</span></dd>
                    <dt class="col-6 col-md-6" :class="[index == 0 ? 'mt-4' : '']">{{ input.name }}</dt>
                  </template>
                </dl>
              </div>
            </div>
            <div class="row text-start">
              <div class="col-12">
                <h5 class="text-muted">{{ t('default.activities') }}</h5>
                <table class="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>{{ t('default.name') }}</th>
                      <th>{{ t('default.actions') }}</th>
                      <th>{{ t('default.smart_contract') }}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="activity in template.activities" :key="activity.id">
                      <td>#{{ activity.id }}</td>
                      <td class="fw-bold">{{ activity.name }}</td>
                      <td>
                        <template v-for="(action, index) in activity.actions" :key="action.code">
                          {{ action.name }}
                          <span v-if="index > 0"> > </span>
                        </template>
                      </td>
                      <td v-if="activity.smartContractId">{{ activity.smartContractId }}</td>
                      <td v-else>dao</td>
                      <td>
                        <template v-for="(action, index) in activity.actions" :key="action.code">
                          {{ action.smartContractMethod }}()<span v-if="index > 0"> → </span>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-if="transactions.length > 0" class="row text-start mt-3">
              <div class="col-12">
                <h5 class="text-muted">{{ t('default.wf_transitions') }}</h5>
                <table class="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>{{ t('default.wf_from') }}</th>
                      <th></th>
                      <th>{{ t('default.wf_to') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="trans in transactions" :key="trans.fromId">
                      <td>#{{ trans.fromId }}</td>
                      <td class="fw-bold">{{ trans.from.name }}</td>
                      <td>→</td>
                      <td class="fw-bold">
                        <template v-for="(activityTo, index) in trans.tos" :key="index">
                          <span v-if="index > 0"> | </span>{{ activityTo.name }}
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  </main>

  <Footer></Footer>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Breadcrumb from '@/components/marketWorkflow/Breadcrumb.vue'
import {
  MDBContainer,
  MDBCard, MDBCardBody, MDBCardText,
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

export default {
  components: {
    Header, Breadcrumb, Footer, MDBContainer,
    MDBCard, MDBCardBody, MDBCardText,
  },
  setup() {
    const { t, n } = useI18n()

    const template = ref({})
    const startActivities = ref([])
    const endActivities = ref([])
    const transactions  = ref([])
    const creator = ref({name: 'unknown'})


    return {
      t, n, template, creator, startActivities, endActivities, transactions
    }
  },
}
</script>