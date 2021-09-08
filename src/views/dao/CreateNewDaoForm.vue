<template>
 <button @click="exampleModal = true" class="nav-link btn brn-ligth p-2" > <span class="d-none d-md-inline">{{ t('default.create_new_dao') }}</span></button>

    <MDBModal
        id="exampleModal"
        tabindex="-1"
        labelledby="exampleModalLabel"
        v-model="exampleModal"
        size="lg"
    >
        <MDBModalHeader>
            <MDBModalTitle id="exampleModalLabel"> {{ t('default.create_new_dao') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody>...</MDBModalBody>
        <MDBModalFooter>
            <MDBBtn color="secondary" @click="exampleModal = false">{{ t('default.close')}}</MDBBtn>
            <MDBBtn color="primary">{{ t('default.create')}}</MDBBtn>
            </MDBModalFooter>
    </MDBModal>
</template>



<script>
    import { useI18n } from 'vue-i18n';
    import { ref } from 'vue';
  import {
    MDBBtn,
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
  } from 'mdb-vue-ui-kit';

export default({
    components: {
        MDBBtn,
        MDBModal,
        MDBModalHeader,
        MDBModalTitle,
        MDBModalBody,
        MDBModalFooter,
    },
    setup() {
        const { t } = useI18n();
        const exampleModal = ref(false);
        return{
           t, exampleModal
        } 
    },
})
</script>
