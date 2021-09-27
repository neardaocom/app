<template>
    <footer class="text-center text-lg-start text-muted" style="background-color: hsl(213, 44%, 97%)">
        <!-- Section: Social media -->
        <section class="
                        d-flex
                        justify-content-center justify-content-lg-between
                        p-4
                        border-bottom
                        container
                        ">
            <!-- Left -->
            <div class="me-5 d-none d-lg-block">
            </div>
            <!-- Left -->

            <!-- Right -->
            <div>
            <span class="me-3">{{ t('default.get_connected_with_us') }}:</span>
            <a :href="app_brand_twitter" class="me-3 text-reset">
                <i class="fab fa-twitter"></i>
            </a>
            <a :href="app_brand_discord" class="me-3 text-reset">
                <i class="fab fa-discord"></i>
            </a>
            </div>
            <!-- Right -->
        </section>
        <!-- Section: Social media -->

        <!-- Section: Links  -->
        <section class="">
            <div class="container text-center text-md-start mt-5">
            <!-- Grid row -->
            <div class="row mt-3">
                <!-- Brand -->
                <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <!-- Content -->
                <h6 class="text-uppercase fw-bold mb-4">
                    <i class="far fa-flag me-3"></i>{{ app_brand_name }}
                </h6>
                <p>{{ app_brand_about }}</p>
                </div>
                <!-- Brand -->

                <!-- Products -->
                <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                <!-- Links -->
                <h6 class="text-uppercase mb-4">{{ t('default.about') }}</h6>
                <p>
                    <a href="https://en.wikipedia.org/wiki/The_DAO_(organization)" class="text-reset" target="_blank">{{ t('default.dao_organization') }}</a>
                </p>
                <p>
                    <a href="https://medium.com/neardao/neardao-proof-of-concept-is-live-1bdf371441ff" class="text-reset" target="_blank">{{ t('default.neardao_launch') }}</a>
                </p>
                </div>
                <!-- Products -->

                <!-- Links -->
                <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <!-- Links -->
                <h6 class="text-uppercase mb-4">{{ t('default.useful_links') }}</h6>
                <p>
                    <a href="https://near.org/" class="text-reset">Near.org</a>
                </p>
                <p>
                    <a href="https://wallet.near.org/profile/dao.near" class="text-reset">{{ t('default.wallet') }}</a>
                </p>
                </div>
                <!-- Links -->

                <!-- Contacts -->
                <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                    <!-- Links -->
                    <h6 class="text-uppercase mb-4">{{ t('default.contacts') }}</h6>
                    <p><i class="fas fa-home me-3"></i> {{ app_brand_address }}</p>
                    <p><i class="fas fa-envelope me-3"></i> {{ app_brand_email }}</p>
                </div>
                <!-- Contacts -->
            </div>
            <!-- Grid row -->
            </div>
        </section>
        <!-- Section: Links  -->

        <!-- Copyright -->
        <div class="text-center p-4" style="background-color: hsla(0, 0%, 17%, 0.04)">
            © {{ today_year }} <a class="text-reset fw-bold" :href="app_brand_web">{{ app_brand_name }}</a> {{ t('default.all_rights_reserved') }}
        </div>
    <!-- Copyright -->
    </footer>
</template>

<script>
import { useI18n } from 'vue-i18n';
export default {
    components: {
        
    },
    setup() {
        const app_brand_name = process.env.VUE_APP_BRAND_NAME;
        const app_brand_about = process.env.VUE_APP_BRAND_ABOUT;
        const app_brand_web = process.env.VUE_APP_BRAND_WEB;
        const app_brand_address = process.env.VUE_APP_BRAND_ADDRESS;
        const app_brand_email = process.env.VUE_APP_BRAND_EMAIL;
        const app_brand_twitter = process.env.VUE_APP_BRAND_TWITTER;
        const app_brand_discord = process.env.VUE_APP_BRAND_DISCORD;

        const {t} = useI18n();

        const today = new Date();
        const today_year = today.getFullYear();

        return {
            app_brand_name, app_brand_about, app_brand_web, app_brand_address, app_brand_email, app_brand_twitter, app_brand_discord
            , today_year, t
        };
    }
}
</script>
