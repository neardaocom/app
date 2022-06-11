<template>
  <main>
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
        <MDBBtn @click="createDao" color="primary" rounded size="lg" class="fs-6 fw-bold bg-gradient-100 m-2 mb-5" style="width:228px"><i class="bi bi-plus me-1"/>{{ t('default.strat_a_dao') }}</MDBBtn>

        <h3 v-if="topList" class="mb-3"> Top 3 DAOs </h3>
        <div v-if="topList" class="row g-1 justify-content-center mb-2" >
          <template v-if="topList.length > 0">
            <router-link  v-for="(dao) in topList" :key="dao.index" :to="{ name: 'dao', params: {id: dao.walletId}, query: {page: 'overview' }}" class="col-10 col-md-4 text-reset mb-2" > 
              <MDBCard class="h-100">
                <MDBCardBody>
                  <!-- <h5 style="height: 15%">{{index+1}}.</h5> -->
                  <MDBBadge color="black" class="mb-1 p-2"><img width="20" height="20" :src="'/img/near_logo.svg'"/></MDBBadge>
                  <h5 class="text-primary h-25"> {{ (dao.name.length > 37) ? dao.name.substring(0, 37) + "..." : dao.name }} </h5>
                  <p class="fst-italic h-25"><small>"{{ (dao.description.length > 65) ? dao.description.substring(0, 65) + "..." : dao.description}}"</small></p>
                  <div class="h-25"> <span class="fw-bold">{{ dao.treasuryAmountUsd }}</span> USD </div>
                </MDBCardBody>
              </MDBCard>
            </router-link>
          </template>
          <template v-else>
            <div class="skeleton rounded col-10 col-md-4" style="height: 190px"/>
            <div class="skeleton rounded col-10 col-md-4" style="height: 190px"/>
            <div class="skeleton rounded col-10 col-md-4" style="height: 190px"/>
          </template>
        </div>

        <MDBBtn @click="organizations"  color="primary" rounded size="lg" class="fs-6 bg-gradient-100 m-2 mb-5" style="width:228px">{{ t('default.see_organizations') }}</MDBBtn>
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

        <MDBBtn @click="neardao" rounded size="lg" class="text-white bg-gradient-100 m-2 fw-normal mb-8" style="width:228px">Join {{config.app.brandName}}</MDBBtn>

        <div class="mb-5">
          <h6 class="text-muted me-3">{{ t('default.connect_with_us') }}</h6>
          <a :href="config.app.brandTwitter" target="_brank" class="me-3 text-reset">
              <i class="fab fa-twitter fa-2x"></i>
          </a>
          <a :href="config.app.brandDiscord" target="_blank" class="me-3 text-reset">
              <i class="fab fa-discord fa-2x"></i>
          </a>
        </div>

        <ul class="text-muted list-unstyled list-inline mb-5">
          <li class="list-inline-item">
            <span class="m-1">© {{ todayYear }} <a class="fw-bold text-dark" :href="config.app.brandWeb">{{ config.app.brandName }}</a> {{ t('default.all_rights_reserved') }}</span>
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
  MDBCardBody,
  MDBBadge
} from 'mdb-vue-ui-kit';
import { useRouter} from 'vue-router'
import { inject } from 'vue'
import { useListTop } from "@/hooks/daoList";

export default {
  name: 'Home',
  components: {
    MDBContainer,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBBadge
  },
  setup() {
    const config = inject('config')

    const { t } = useI18n();
    const router = useRouter(config)

    const { list, topList, adminAccountId } = useListTop(3, config.value)

    const organizations = () => {
      router.push({ name: 'dao-list'})
    }

    const createDao = () => {
      router.push({ name: 'dao-create'})
    }

    const neardao = () => {
      router.push({ name: 'dao', params: {id: `${config.value.app.daoDefault}`}})
    }

    const todayYear = new Date().getFullYear();
      
    return { 
      t,
      config,
      list,
      topList,
      adminAccountId,
      organizations,
      createDao,
      neardao,
      todayYear
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