<template>
  <section>
    <!-- Background image -->
    <div class="bg-image title-background-image position-relative">
      <div class="mask">
        <div class="d-flex position-absolute top-0 end-0 me-4 mt-3">
          <MDBDropdown btnGroup v-model="dropdown1" >
            <MDBDropdownToggle @click="dropdown1 = !dropdown1" size="sm" color="secondary" >
              <span class="me-1">{{t('default.dao_wallet')}}</span>
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'about' }}">
                <i class="bi bi-info-square me-1"/> 
                {{ t('default.about') }}
              </MDBDropdownItem>
              <MDBDropdownItem tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'settings' }}">
                <i class="bi bi-gear me-1"/> 
                {{ t('default.settings') }}
              </MDBDropdownItem>
              <MDBDropdownItem tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'defi' }}">
                <i class="bi bi-graph-up me-1"/>
                {{ t('default.dApps') }}
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </div>

        <div class="d-flex justify-content-center align-items-center h-100">
          <div class="">
            <img v-if="false" height="35" width="140" src="/img/near_logo.svg" alt="Near logo" />
            <h1 class="mb-2 text-dark" style="font-size: 3em;"><strong>{{dao.name}}</strong></h1>
            <h5 class="mb-2 text-dark">{{dao.purpose}}</h5>
          </div>
        </div>
      </div>
    </div>
    <!-- Background image -->
  </section>
</template>

<script>
import { MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBDropdownToggle } from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
import { ref } from '@vue/reactivity';

export default {
  components: {
    MDBDropdown, 
    MDBDropdownMenu, 
    MDBDropdownItem,
    MDBDropdownToggle
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
  },
  setup(){
    const {t} = useI18n()
    const dropdown1 = ref(false)
    return{
      t,
      dropdown1
    }
  }
};
</script>
