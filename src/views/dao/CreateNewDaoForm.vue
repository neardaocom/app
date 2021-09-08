<template>
    <MDBBtn  @click="exampleModal = true" class="btn btn-black btn-rounded mx-2" >{{ t('default.create_new_dao') }}</MDBBtn>

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
        <MDBModalBody>
            
            <!-- Form -->
            <MDBRow tag="form" class="g-3 needs-validation" novalidate @submit.prevent="checkForm">
                <MDBCol col="12">
                    <MDBInput
                        :label="t('default.dao_name')"
                        v-model="daoName"
                        :invalidFeedback="t('default.dao_form_invalid_feedback')" 
                        :validFeedback="t('default.dao_form_valid_feedback')" 
                        required
                    />
                </MDBCol>
                <MDBCol col="12">
                    <MDBTextarea
                        :label="t('default.dao_purpose')"
                        rows="3"
                        v-model="daoPurpose"
                        :invalidFeedback="t('default.dao_form_invalid_feedback')" 
                        :validFeedback="t('default.dao_form_valid_feedback')" 
                        required
                    />
                </MDBCol>

                <MDBCol col="12">
                    <MDBTextarea
                        :label="t('default.dao_council')"
                        rows="2"
                        v-model="daoCouncil"
                        :invalidFeedback="t('default.dao_form_invalid_feedback')" 
                        :validFeedback="t('default.dao_form_valid_feedback')" 
                        required
                    />
                </MDBCol>

                <MDBCol col="12">
                <MDBTextarea
                    :label="t('default.dao_tags')"
                    rows="2"
                    v-model="daoTags"
                    :invalidFeedback="t('default.dao_form_invalid_feedback')" 
                    :validFeedback="t('default.dao_form_valid_feedback')" 
                />
                </MDBCol>

                <MDBCol col="12">
                    <MDBInput
                        :label="t('default.dao_initital_treasury')"
                        v-model="treasury"
                        :invalidFeedback="t('default.dao_form_invalid_feedback')" 
                        :validFeedback="t('default.dao_form_valid_feedback')" 
                        required
                    />
                </MDBCol>

                <MDBCol col="12">
                    <MDBBtn color="primary" type="submit">{{ t('default.create') }} </MDBBtn>
                </MDBCol>
            </MDBRow>

            <!-- /Form -->


            <!-- <form class="needs-validation" novalidate  @submit.prevent="checkForm"> 
                <div class="mb-4">
                    <MDBInput
                        :label="t('default.dao_name')"
                        v-model="daoName"
                        invalidFeedback="Example invalid form file feedback"
                        required
                    />
                </div>

                <div class="mb-3">
                    <MDBTextarea
                        :label="t('default.dao_purpose')"
                        rows="3"
                        v-model="daoPurpose"
                        invalidFeedback="Please enter a message in the textarea"
                        required
                    />
                </div>

                <div class="mb-3">
                    <MDBTextarea
                        :label="t('default.dao_council')"
                        rows="2"
                        v-model="daoCouncil"
                        invalidFeedback="Please enter a message in the textarea"
                        required
                    />
                </div>

                <div class="mb-3">
                    <MDBTextarea
                        :label="t('default.dao_tags')"
                        rows="2"
                        v-model="daoTags"
                        invalidFeedback="Please enter a message in the textarea"
                        required
                    />
                </div>

                <div class="mb-4">
                    <MDBInput
                        :label="t('default.dao_initital_treasury')"
                        v-model="treasury"
                        invalidFeedback="Example invalid form file feedback"
                        required
                    />
                </div> 

                <div class="pb-4">
                    <MDBBtn color="primary" type="submit">{{ t('default.create') }} </MDBBtn>
                </div>
            </form> -->


        </MDBModalBody>
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
    //MDBModalFooter,
    MDBTextarea,
    MDBInput,
    MDBRow,
    MDBCol,
  } from 'mdb-vue-ui-kit';

export default({
    components: {
        MDBBtn,
        MDBModal,
        MDBModalHeader,
        MDBModalTitle,
        MDBModalBody,
        //MDBModalFooter,
        MDBTextarea,
        MDBInput,
        MDBRow,
        MDBCol
    },
    setup() {
        const { t } = useI18n();
        const exampleModal = ref(false);        
        const daoName = ref('');
        const daoPurpose = ref('');
        const daoCouncil = ref('');
        const daoTags = ref('')
        const daoInitialTreasury = ref()

        const checkForm = (e) => {
            e.target.classList.add('was-validated');
        };
        return{
           t, exampleModal, daoName, daoPurpose, daoCouncil, daoTags, daoInitialTreasury, checkForm
        } 
    },
})
</script>
