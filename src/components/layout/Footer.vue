<template>
    <!-- <footer class="text-center text-lg-start text-muted" >-->
    <MDBFooter :text="['center', 'lg-start']" style="background-color: hsl(213, 44%, 97%)">
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
            <span class="me-3">{{ t('default.connect_with_us') }}:</span>
            <a :href="config.app.brandTwitter" target="_blank" class="me-3 text-reset">
                <i class="fab fa-twitter"></i>
            </a>
            <a :href="config.app.brandDiscord" target="_blank" class="me-3 text-reset">
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
                <h6 class="text-uppercase fw-bold mb-4 color-primary">
                    <i class="far fa-flag me-3"></i>{{ config.app.brandName }}
                </h6>
                <p>{{ config.app.brandAbout }}</p>
                </div>
                <!-- Brand -->

                <!-- Products -->
                <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                <!-- Links -->
                <h6 class="text-uppercase mb-4 text-primary">{{ t('default.about') }}</h6>
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
                <h6 class="text-uppercase mb-4 text-primary">{{ t('default.useful_links') }}</h6>
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
                    <h6 class="text-uppercase mb-4 color-primary">{{ t('default.contacts') }}</h6>
                    <p><i class="bi bi-house color-primary me-3"/> {{ config.app.brandAddress }}</p>
                    <p><i class="bi bi-envelope color-primary me-3"/> {{ config.app.brandEmail }}</p>
                </div>
                <!-- Contacts -->
            </div>
            <!-- Grid row -->
            </div>
        </section>
        <!-- Section: Links  -->

        <section class="text-center">
            <img class="me-1" :src="config.app.baseUrl + 'img/logo_neardao.png'" alt="" style="width: 80px;"/>
            <h6>NearDAO</h6>
        </section>

        <!-- Copyright -->
        <div class="text-center p-4" style="background-color: hsla(0, 0%, 17%, 0.04)">
            © {{ todayYear }} <a class="text-reset fw-bold" :href="config.app.brandWeb">{{ config.app.brandName }}</a> {{ t('default.all_rights_reserved') }}
            <span class="ms-4 me-1">{{ t('default.powered_by') }}</span><a class="text-reset" href="https://near.org/"><img class="me-1" :src="config.app.baseUrl + 'img/near.svg'" alt="" style="width: 70px;"/></a>
        </div>
    <!-- Copyright -->
    </MDBFooter>
</template>

<script>
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { MDBFooter } from "mdb-vue-ui-kit"
export default {
    components: {
        MDBFooter
    },
    setup() {
        const config = inject('config')

        const {t} = useI18n();

        const todayYear = new Date().getFullYear();

        return {
            config, todayYear, t,
        };
    }
}
</script>
