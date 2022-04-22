<template>
  <MDBBtn class="btn btn-primary" v-if="list.length == 0">{{ version }}</MDBBtn>
  <MDBDropdown v-else btnGroup v-model="dropdown">
    <MDBDropdownToggle
      class="btn btn-primary"
      @click="dropdown = !dropdown"
      ><span class="me-1">{{ version }}</span></MDBDropdownToggle
    >
    <MDBDropdownMenu>
      <MDBDropdownItem v-for="(doc, index) in list" :key="index" tag="button" @click="openDoc(doc.index)">{{ doc.version }}</MDBDropdownItem>
    </MDBDropdownMenu>
  </MDBDropdown>  
</template>

<script>
  import { MDBBtn, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdb-vue-ui-kit";
  import { ref, toRefs } from 'vue';

  export default {
    components: {
      MDBBtn,
      MDBDropdown,
      MDBDropdownToggle,
      MDBDropdownMenu,
      MDBDropdownItem
    },
    props: {
      list: {
        type: Array,
        required: true,
      },
      version: {
        type: String,
        required: true,
      },
      open: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      const { open } = toRefs(props)
      const openIndex = ref(open)
      const dropdown = ref(false);

      return {
        dropdown, openIndex
      }
    },
    methods: {
      openDoc(index) {
        this.openIndex = index
      }
    }
  };
</script>