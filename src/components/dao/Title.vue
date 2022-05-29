<template>
  <section>
    <!-- Background image -->
    <div class="bg-image title-background-image position-relative">
      <div class="mask">
        <div class="d-flex position-absolute top-0 end-0 me-4 mt-3">

        <MDBDropdown btnGroup v-model="dropdown1" >
          <MDBBtn color="primary" tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'rewards' }}" size="sm" class="bg-gradient-110">
            <i class="bi bi-coin me-2"/>{{t('default.rewards')}}
          </MDBBtn>
          <MDBDropdownToggle split @click="dropdown1 = !dropdown1" size="sm" class="bg-gradient-110" />
          <MDBDropdownMenu>
            <MDBDropdownItem tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'about' }}">
              {{ t('default.about') }}
            </MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
<!-- 
          <MDBBtnGroup size="sm">
            <MDBBtn color="primary" tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'wallet_account' }}" class="text-white" >
              <i class="bi bi-wallet2 me-2"/>{{t('default.dao_wallet')}}
            </MDBBtn>
            <MDBBtnGroup size="sm" id="dropdown-target">
              <MDBBtn color="primary" @click="dropdown1 = !dropdown1" class="dropdown-toggle text-white"/>
              <MDBDropdown v-model="dropdown1">
                <MDBDropdownMenu>
                  <MDBDropdownItem tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'about' }}">
                    {{ t('default.about') }}
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBBtnGroup>
          </MDBBtnGroup> -->


          <!-- <MDBBtn tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'wallet_account' }}" size="sm" rounded class="bg-gradient-110 text-white me-2" >
            <i class="bi bi-wallet2 me-2"/>{{t('default.dao_wallet')}}
          </MDBBtn>
            <MDBDropdown v-model="dropdown1">
              <MDBDropdownToggle color="muted" size="sm" @click="dropdown1 = !dropdown1">
              </MDBDropdownToggle>
              <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
                <MDBDropdownItem tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'about' }}">
                  {{ t('default.about') }}
                </MDBDropdownItem>
                <MDBDropdownItem tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'defi' }}">
                  {{ t('default.dApps') }}
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown> -->
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
import { MDBBtn, MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBDropdownToggle } from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
import { ref } from '@vue/reactivity';

export default {
  components: {
    MDBBtn,
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
