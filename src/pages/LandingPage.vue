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
        <img :src="'/img/logo_with_text.png'" alt="" class="logo-style mb-4"/>
        <h1 class="mb-0 mt-4">NearDAO</h1>
        <p class="fs-5 text-center">Launch a DAO in 5 minutes</p>
      </div>
    </div>
    <div class="row">
      <div class="col-10 offset-1">
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
        <div class="d-flex flex-wrap justify-content-center mb-8" >
          <MDBBtn @click="organizations" rounded size="lg" class="text-white gradient-background m-2 fw-normal" style="width:228px">{{ t('default.organizations') }}</MDBBtn>
          <MDBBtn @click="createDao" rounded size="lg" class="fs-6 text-white gradient-background m-2 fw-bold" style="width:228px"><i class="bi bi-plus me-1"/>{{ t('default.create_dao')+"   " }}</MDBBtn>
        </div>

        <div class="mb-5">
          <h6 class="text-muted me-3">{{ t('default.get_connected_with_us') }}</h6>
          <a :href="app_brand_twitter" class="me-3 text-reset">
              <i class="fab fa-twitter fa-2x"></i>
          </a>
          <a :href="app_brand_discord" class="me-3 text-reset">
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
import { MDBContainer, MDBBtn } from 'mdb-vue-ui-kit';
import { useRouter} from 'vue-router'

export default {
  name: 'Home',
  components: {
    MDBContainer,
    MDBBtn
  },
  setup() {
    const { t } = useI18n();
    const daoDefault = process.env.VUE_APP_DAO_DEFAULT
    const router = useRouter()

    const organizations = () => {
      router.push({ name: 'dao-list'})
    }

    const createDao = () => {
      router.push({ name: 'dao-create'})
    }

    const app_brand_name = process.env.VUE_APP_BRAND_NAME;
    const app_brand_web = process.env.VUE_APP_BRAND_WEB;
    const app_brand_twitter = process.env.VUE_APP_BRAND_TWITTER;
    const app_brand_discord = process.env.VUE_APP_BRAND_DISCORD;

    const today = new Date();
    const today_year = today.getFullYear();
      
    return { 
      t,
      daoDefault,
      organizations,
      createDao,
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