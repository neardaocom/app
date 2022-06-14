<template>
  <MDBModal
    id="modalProposal"
    tabindex="-1"
    labelledby="modalProposalLabel"
    v-model="active"
  >
  <MDBModalHeader v-if="title">
      <MDBModalTitle id="modalProposalLabel"> {{ title }} </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody class="text-start">
        <slot :isValid="isValidHandler"></slot>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn outline="secondary" rounded @click="close()">{{ t('default.close') }}</MDBBtn>
      <ButtonLoader v-if="submitText" :loading="btnLoad" outline="primary" rounded @click="submit()"> {{ submitText }} </ButtonLoader>
    </MDBModalFooter>
  </MDBModal>
</template>

<script>
import {
    MDBModal,
    MDBModalTitle,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn
} from "mdb-vue-ui-kit";
import { ref, toRefs } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n';
import ButtonLoader from '@/components/ui/ButtonLoader.vue'

export default {
  components:{
    MDBModal,
    MDBModalTitle,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
    ButtonLoader
  },
  props: {
    show: {
      type: Number,
      required: true
    },
    title:{
      type: String,
      required: false
    },
    submitText:{
      type: String,
      required: true
    }
  },
  emits: ['submit'],
  setup (props, {emit}) {
    const { show } = toRefs(props)
    const {t} = useI18n()
    const active = ref(false)
    const btnLoad = ref(false) 

    const openModal = () => { 
      btnLoad.value = false
      active.value = true 
    }

    watch(show, openModal)

    const close = () => {
      active.value = false
    }
    
    const submit = () => {
      emit('submit')
    }

    const isValidHandler = (value) => {
      btnLoad.value = value
    }

    return {
      t,
      active,
      submit,
      close,
      btnLoad,
      isValidHandler
    }
  }
}
</script>