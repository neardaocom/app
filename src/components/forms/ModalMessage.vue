<template>
  <MDBModal
    id="modalMessage"
    tabindex="-1"
    labelledby="modalMessageLabel"
    v-model="active"
    size="lg"
  >
  <MDBModalHeader>
      <MDBModalTitle id="modalMessageLabel">{{ title }}</MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody class="text-start">
        <slot></slot>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn outline="secondary" rounded @click="close()">{{ t('default.close') }}</MDBBtn>
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
  setup (props) {
    const { show } = toRefs(props)

    const { t } = useI18n()

    const active = ref(false)
    
    const openModal = () => { active.value = true }

    watch(show, openModal)

    const close = () => {
      active.value = false
    }
    
    return {
      t, active, close,
    }
  }
}
</script>