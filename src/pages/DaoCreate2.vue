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
                        <DaoCreateForm/>
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
import Breadcrumb from '@/components/daoCreate/Breadcrumb.vue'
import DaoCreateForm from '@/components/daoCreate/DaoCreateForm.vue'
import {
    MDBContainer,
    //MDBAlert
} from 'mdb-vue-ui-kit';
import { useI18n } from 'vue-i18n';
import { inject, onMounted } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { useNear } from '@/hooks/vuex';

export default {
    components:{
        Header,
        Footer,
        Breadcrumb,
        MDBContainer,
        //MDBAlert,
        DaoCreateForm
    },
    setup(){
        const { t } = useI18n();
        const logger = inject('logger')
        const router = useRouter()
        const { accountId } = useNear()
        
        onMounted(() => {
            if (localStorage.create_dao_account !== undefined && localStorage.create_dao_account !== null && localStorage.create_dao_account.length > 0) {
                const daoAccountId = localStorage.create_dao_account
                localStorage.create_dao_account = ''
                logger.notice('B', 'dao', 'create', `User [${accountId.value}] created DAO named [${daoAccountId}]`)
                router.push({name: 'dao', params: {id: daoAccountId}})
            }
        })
        return {
            t
        }
    }
        
}
</script>