<template>
  <main>
    <!-- <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
      <MDBSpinner>
        <span class="sr-only">{{ t('default.loading') }}...</span>
      </MDBSpinner>
    </div> -->

  <MDBContainer style="max-width: 630px;">
    <img :src="'/img/logo_with_text.png'" alt="" class="logo-style mb-9"/>
    <p class="text-muted mb-8" style="font-size:14px">
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc dapibus tortor vel mi dapibus sollicitudin. Nullam dapibus fermentum ipsum. Aliquam erat volutpat. Vestibulum fermentum tortor id mi. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Pellentesque ipsum. Etiam egestas wisi a erat.
    </p>
    <div class="d-flex flex-wrap justify-content-center mb-8" >
      <MDBBtn @click="organizations" rounded size="lg" class="fs-6 text-white gradient-background  m-2" style="width:228px">{{ t('default.organizations') }}</MDBBtn>
      <MDBBtn @click="createDao" rounded size="lg" class="fs-6 text-white gradient-background m-2" style="width:228px"><i class="bi bi-plus me-1"/>{{ t('default.create_dao')+"   " }}</MDBBtn>
    </div>

    <div class="text-muted mb-5">
      <h6 class="me-3">{{ t('default.get_connected_with_us') }}</h6>
      <a :href="app_brand_twitter" class="me-3 text-reset">
          <i class="fab fa-twitter"></i>
      </a>
      <a :href="app_brand_discord" class="me-3 text-reset">
          <i class="fab fa-discord"></i>
      </a>
    </div>


     <ul class="text-muted list-unstyled list-inline mb-5">
        <li class="list-inline-item">
           <span class="m-1">© {{ today_year }} <a class="text-reset fw-bold" :href="app_brand_web">{{ app_brand_name }}</a> {{ t('default.all_rights_reserved') }}</span>
        </li>
        <li class="list-inline-item">
          <span class="m-1">{{ t('default.powered_by') }}<a class="text-reset" href="https://near.org/"><img class="ms-1" :src="'/img/near.svg'" alt="" style="width: 70px;"/></a> </span>
        </li>
      </ul>

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
  .logo-style{
    width: 241px;
    margin-top: 90px;
    /* margin-bottom: 120px; */
    /* vertical-align: top */
  }
</style>