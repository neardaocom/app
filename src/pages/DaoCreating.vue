<template>
    <Header></Header>
    <main>
        <MDBContainer>
            <Breadcrumb :list-name="'create_dao'" />
        </MDBContainer>
        <section class="mb-3">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h2>{{ t('default.create_your_dao')}}</h2>
                        <h6>{{ t('default.create_your_dao_sub')}}</h6>
                    </div>
                </div>
                <div class="card text-start w-auto p-2 mt-4">
                    <div class="card-body">
                        <h4>{{ t('default.summary') }}</h4>
                        <Summary :values="formCreateDao.data"/>
                        <MDBBtn wrapperClass="mt-10 mb-2" color="success" @click="createToken(formCreateDao.data)" size="lg" :disabled="formCreateDao.step !== 'fromSubmited'">{{ t('default.create_token') }}</MDBBtn>
                        <MDBBtn wrapperClass="mt-10 mb-2" color="success" @click="createDao(formCreateDao.data)" size="lg" :disabled="formCreateDao.step !== 'tokenCreated'">{{ t('default.create_dao') }}</MDBBtn>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <!-- <MDBAlert v-model="fieldErrorAlert" width="250px" position="top-center" autohide appendToBody color="danger"> {{t('default.invalid_field_form')}} </MDBAlert>
    <MDBAlert v-model="createDaoErrorAlert" width="250px" position="top-center" autohide appendToBody color="danger"> {{t('default.invalid_field_form')}} </MDBAlert> -->
  <Footer></Footer>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'
import Summary from '@/components/daoCreate/Summary.vue'
import {
    MDBContainer,
    MDBBtn,
    //MDBAlert
} from 'mdb-vue-ui-kit';
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { onMounted } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRoute } from "vue-router";
//import { useNear } from '@/hooks/vuex';
import { useCreateToken } from '@/hooks/ft';
import { useAccounts, useFormStep, useCreateDAO } from "@/hooks/createDao";
import { useNearBlockchainTransaction } from "@/hooks/router";

export default {
    components:{
        Header,
        Footer,
        Breadcrumb,
        MDBContainer,
        MDBBtn,
        //MDBAlert,
        Summary,
    },
    setup() {
        const { t } = useI18n();
        const store = useStore()
        const route = useRoute()
        const { getState, tokenCreated, daoCreated } = useFormStep()
        const loader = inject('loader')
        const config = inject('config')

        const { transactionHashes, transactionStatus } = useNearBlockchainTransaction()

        const formCreateDao = ref(getState())
        const formData = ref(formCreateDao.value.data)

        const { daoAccountId } = useAccounts(config, formData)

        const { createToken } = useCreateToken(loader, config, daoAccountId.value)

        //const logger = inject('logger')
        //const router = useRouter()
        //const { accountId } = useNear()
        
        onMounted(() => {
            if (transactionStatus.value === 'success') {
                if (formCreateDao.value.step === 'fromSubmited') {
                    formCreateDao.value = tokenCreated(transactionHashes.value)
                } else if (formCreateDao.value.step === 'tokenCreated' && transactionHashes.value !== formCreateDao.value.transactionHash) {
                    daoCreated()
                    route.push({ name: 'dao', params: {id: daoAccountId.value}})
                } else {
                    // TODO: Wrong state
                }
            } else {
                // TODO: Wrong state
            }
        })
        return {
            t, formCreateDao, createToken, formData, transactionHashes, transactionStatus
        }
    }
        
}
</script>