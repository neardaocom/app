<template>
    <Header></Header>
    <main>
        <MDBContainer>
            <Breadcrumb :list-name="'create_dao'" />
        </MDBContainer>
        <section class="mb-3">
            <div class="container">
                <div class="row">
                    <div class="col-12 text-center">
                    <h2>{{ t('default.create_dao')}} {{ t('default.form')}}</h2>
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
    <MDBAlert v-model="fieldErrorAlert" width="250px" position="top-center" autohide appendToBody color="danger"> {{t('default.invalid_field_form')}} </MDBAlert>
    <MDBAlert v-model="createDaoErrorAlert" width="250px" position="top-center" autohide appendToBody color="danger"> {{t('default.invalid_field_form')}} </MDBAlert>
  <Footer></Footer>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Breadcrumb from '@/components/daoCreate/Breadcrumb.vue'
import DaoCreateForm from '@/components/daoCreate/DaoCreateForm.vue'
import {
    MDBContainer,
    MDBAlert
} from 'mdb-vue-ui-kit';
import { useI18n } from 'vue-i18n';

export default {
    components:{
        Header,
        Footer,
        Breadcrumb,
        MDBContainer,
        MDBAlert,
        DaoCreateForm
    },
    setup(){
        const { t} = useI18n();
        return {
            t
        }
    }
        
}
</script>