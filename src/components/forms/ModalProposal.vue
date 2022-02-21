<template>
  <MDBModal
    id="modalProposal"
    tabindex="-1"
    labelledby="modalProposalLabel"
    v-model="active"
    size="lg"
  >
  <MDBModalHeader>
      <MDBModalTitle id="modalProposalLabel"> {{ title }} </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody class="text-start">
        <slot></slot>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn outline="secondary" rounded @click="close()">{{ t('default.close') }}</MDBBtn>
      <MDBBtn outline="primary" rounded @click="vote()">{{ t('default.vote') }}</MDBBtn>
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

export default {
  components:{
    MDBModal,
    MDBModalTitle,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn
  },
  props: {
    show: {
      type: Number,
      required: true
    },
    title:{
      type: String,
      required: true
    }
  },
  emits: ['vote'],
  setup (props, {emit}) {
    const { show } = toRefs(props)
    const {t} = useI18n()
    const active = ref(false)
    
    const openModal = () => { active.value = true }

    watch(show, openModal)

    const close = () => {
      active.value = false
    }
    
    const vote = () => {
      emit('vote')
    }
    return {
      t,
      active,
      vote,
      close
    }
  }
}
</script>