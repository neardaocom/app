<template>
   <MDBTooltip v-model="tooltip" tag="a">
      <template #reference>
         <i class="bi bi-info-circle-fill" :class="`text-${color}`"/>
      </template>
      <template #tip>
        {{text}}
      </template>
    </MDBTooltip>
</template>

<script>
  import { MDBTooltip } from "mdb-vue-ui-kit";
import { ref } from '@vue/reactivity';

export default {
   components: {
      MDBTooltip
   },
   props:{
      text:{
         type: String,
         required: true
      },
      color:{
         type: String,
         required: false,
         default: 'muted',
      }
   },
   setup () {
      const tooltip = ref(false)
      
      return {
        tooltip
      }
   }
}
</script>