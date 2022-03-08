<template>
  <main>
    <!-- <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
      <MDBSpinner>
        <span class="sr-only">{{ t('default.loading') }}...</span>
      </MDBSpinner>
    </div> -->

  <MDBContainer style="max-width: 630px;">
    <div class="row">
      <div class="col-12">
        <img :src="'/img/logo_with_text_cropt.png'" alt="" class="logo-style mb-4"/>
        <h1 class="mb-0 mt-4">NearDAO</h1>
        <p class="fs-5 text-center">Launch a DAO in 5 minutes</p>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <MDBBtn @click="createDao" rounded size="lg" class="fs-6 text-white gradient-background m-2 fw-bold mb-5" style="width:228px"><i class="bi bi-plus me-1"/>{{ t('default.strat_a_dao') }}</MDBBtn>
        
        <h3 class="mb-3"> Top 3 DAOs </h3>
        
        <!-- <div v-if="topDaos" class="d-flex flex-wrap justify-content-around mb-4" >
          <router-link v-for="(dao, index) in topDaos" :key="index" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'overview' }}" class="text-reset" > 
            <MDBCard >
              <MDBCardBody>
                <h5>{{index+1}}.</h5>
                <h5 class="color-primary"> {{dao[1].name}} </h5>
                <p class="fst-italic"><small>"{{dao[1].description}}"</small></p>
                <span class="fw-bold">{{dao.amount.toFixed(2)}}</span> USD
              </MDBCardBody>
            </MDBCard>
          </router-link>
        </div> -->

        <div v-if="topDaos" class="row g-1 justify-content-center mb-2" >
          <router-link v-for="(dao, index) in topDaos" :key="index" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'overview' }}" class="col-10 col-md-4 text-reset mb-2" > 
            <MDBCard class="h-100">
              <MDBCardBody>
                <h5>{{index+1}}.</h5>
                <h5 class="color-primary"> {{dao[1].name}} </h5>
                <p class="fst-italic"><small>"{{dao[1].description}}"</small></p>
                <span class="fw-bold">{{dao.amount.toFixed(2)}}</span> USD
              </MDBCardBody>
            </MDBCard>
          </router-link>
        </div>


        <MDBBtn @click="organizations" rounded size="lg" class="text-white gradient-background m-2 fw-normal mb-5" style="width:228px">{{ t('default.see_organizations') }}</MDBBtn>
        <div class="row  justify-content-center">
          <div class="col-10"> 
            <p class="text-muted">
              The way we launch and run companies today is slow and inefficient.
              You need lawyers, notaries and banks to even start, accept or send out a payment.
              It takes weeks and hundreds of slowly inflating dollars to just begin…
            </p>
            <p class="text-muted">
              So, what if you needed only a few minutes, a couple of $NEARs and your favourite social network to simply gather your friends and start doing business now?
            </p>
            <p class="text-muted">
              We are Introducing NearDAO - a digital, immutable and first-time truly agile platform to launch, develop and grow your own Decentralised Autonomous Organisation (DAO) on <a href="https://www.near.org>" target="_blank">Near Protocol</a> - a truly user-friendly, scalable blockchain - just few steps away.
            </p>
            <p class="text-muted">
              Join us, we are near.
            </p>
          </div>
        </div>

        <MDBBtn @click="neardao" rounded size="lg" class="text-white gradient-background m-2 fw-normal mb-8" style="width:228px">Join {{app_brand_name}}</MDBBtn>

        <div class="mb-5">
          <h6 class="text-muted me-3">{{ t('default.connect_with_us') }}</h6>
          <a :href="app_brand_twitter" target="_brank" class="me-3 text-reset">
              <i class="fab fa-twitter fa-2x"></i>
          </a>
          <a :href="app_brand_discord" target="_blank" class="me-3 text-reset">
              <i class="fab fa-discord fa-2x"></i>
          </a>
        </div>

        <ul class="text-muted list-unstyled list-inline mb-5">
          <li class="list-inline-item">
            <span class="m-1">© {{ today_year }} <a class="fw-bold text-dark" :href="app_brand_web">{{ app_brand_name }}</a> {{ t('default.all_rights_reserved') }}</span>
          </li>
          <li class="list-inline-item">
            <span class="m-1">{{ t('default.powered_by') }}<a class="text-reset" href="https://near.org/"><img class="ms-1" :src="'/img/near.svg'" alt="" style="width: 70px;"/></a> </span>
          </li>
        </ul>
      </div>
    </div>
  </MDBContainer>
  </main>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { 
  MDBContainer,
  MDBBtn, 
  MDBCard, 
  MDBCardBody 
} from 'mdb-vue-ui-kit';
import { useRouter} from 'vue-router'
import { useNear } from '@/hooks/vuex';
import { inject, onMounted, ref, watch} from '@vue/runtime-core';
import Decimal from 'decimal.js';

export default {
  name: 'Home',
  components: {
    MDBContainer,
    MDBBtn,
    MDBCard,
    MDBCardBody
  },
  setup() {
    const { t } = useI18n();
    const daoDefault = process.env.VUE_APP_DAO_DEFAULT
    const router = useRouter()
    const { nearService, factoryAccount } = useNear()
    const topDaos = ref([])
    const nearPrice = inject('nearPrice')

    const organizations = () => {
      router.push({ name: 'dao-list'})
    }

    const createDao = () => {
      router.push({ name: 'dao-create'})
    }

    const neardao = () => {
      router.push({name: 'dao', params: {id: `${process.env.VUE_APP_BRAND}.${process.env.VUE_APP_NEAR_CONTRACT_NAME}`}})
    }

    const app_brand_name = process.env.VUE_APP_BRAND_NAME;
    const app_brand_web = process.env.VUE_APP_BRAND_WEB;
    const app_brand_twitter = process.env.VUE_APP_BRAND_TWITTER;
    const app_brand_discord = process.env.VUE_APP_BRAND_DISCORD;

    const today = new Date();
    const today_year = today.getFullYear();

    const fetchDaos = async () => {
      if (nearPrice.value){
        const daoList = await nearService.value.getDaoList()
        const amounts = await nearService.value.getDaosAmount(daoList.map((dao) => `${dao[0]}.${factoryAccount.value}`))
        daoList.forEach((element, index) => {
          element.amount = new Decimal(amounts[index]).times(nearPrice.value)
          element.wallet = `${element[0]}.${factoryAccount.value}`
        })
        topDaos.value =  daoList.sort((first, second) => second.amount.minus(first.amount)).slice(0,3)
      }
    }

    watch(nearPrice, () =>{
      fetchDaos()
    })
    
    onMounted(() => {
      fetchDaos()
    })
      
    return { 
      t,
      daoDefault,
      organizations,
      createDao,
      neardao,
      nearPrice,
      topDaos,
      app_brand_name,
      app_brand_web,
      app_brand_twitter,
      app_brand_discord,
      today_year
    }
  }
}
</script>

<style scoped>
  .logo-style {
    /* width: 241px; */
    width: 100%;
    margin-top: 70px;
    /* margin-bottom: 120px; */
    /* vertical-align: top */
  }

  p.landing-page-text {
    font-size:14px;
  }
</style>