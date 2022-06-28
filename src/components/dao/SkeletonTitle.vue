<template>
  <section>
        <div class="bg-image title-background-image">
          <div class="mask">
            <div class="d-flex position-absolute top-0 end-0 me-4 mt-3">
              <MDBDropdown btnGroup v-model="dropdown1" >
                <MDBDropdownToggle @click="dropdown1 = !dropdown1" size="sm" color="secondary" >
                  <span class="me-1">{{t('dao_wallet')}}</span>
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'about' }}">
                    <i class="bi bi-info-square me-1"/> 
                    {{ t('about') }}
                  </MDBDropdownItem>
                  <MDBDropdownItem tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'settings' }}">
                    <i class="bi bi-gear me-1"/> 
                    {{ t('settings') }}
                  </MDBDropdownItem>
                  <MDBDropdownItem tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'defi' }}">
                    <i class="bi bi-graph-up me-1"/>
                    {{ t('dApps') }}
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </div>
            <div class=" row d-flex justify-content-center align-items-center h-100">
              <div class="col-lg-6 mt-4">
                  <div class="mb-2 skeleton skeleton-h1 rounded w-50"></div>
                  <div class="mb-2 skeleton skeleton-text rounded w-75"></div>   
              </div>             
            </div>
          </div>
        </div>
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