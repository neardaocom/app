<template>
    <div class="card text-start w-auto p-2" style="width: 18rem">
        <div class="card-body">
        <ul class="list-unstyled text-muted mb-1">
            <li>
                <MDBIcon class="me-3 mb-3" icon="wallet" iconStyle="fas" />
                <a
                    class="text-reset"
                    :href="walletUrl + '/accounts/' + dao.wallet"
                    target="_blank"
                >
                    {{ dao.wallet }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                </a>
            </li>
            <li>
                <MDBIcon class="me-3 mb-3" icon="users" iconStyle="fas" />
                <span class="text-reset font-weight-bold">{{ n(users) }}</span> {{ t('default.members') }}
            </li>
            <li v-if="false">
                <i class="fas fa-money-bill-wave-alt fa-fw me-3 mb-3"></i>
                <span class="text-reset font-weight-bold">{{ n(dao.token) }}</span> {{ dao.token_name }}
            </li>
        </ul>
        <ul class="list-inline mb-2">
            <li v-if="web" class="list-inline-item mb-1">
                <a :href="web" class="btn btn-info btn-xs" target="_blank">
                    <MDBIcon class="me-1" size="sm" icon="globe" iconStyle="fas" />{{ t('default.web') }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                </a>
            </li>
            <li v-if="wiki" class="list-inline-item mb-1">
                <a :href="wiki" class="btn btn-info btn-xs" target="_blank">
                    <MDBIcon class="me-1" size="sm" icon="database" iconStyle="fas" />{{ t("default.wiki") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                </a>
            </li>
            <li v-if="whitepaper" class="list-inline-item mb-1" >
                <a :href="whitepaper" class="btn btn-info btn-xs" target="_blank">
                    <MDBIcon class="me-1" size="sm" icon="book" iconStyle="fas" />{{ t("default.whitepaper") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                </a>
            </li>
            <li v-if="sourceCode" class="list-inline-item mb-1">
                <a :href="sourceCode" class="btn btn-info btn-xs" target="_blank">
                    <MDBIcon class="me-1" size="sm" icon="file-code" iconStyle="fas" />{{ t("default.source_code") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                </a>
            </li>
        </ul>
        <ul class="list-inline mb-0">
            <li v-if="kycStatus || kycDocument" class="list-inline-item mb-1">
                <MDBBtnGroup id="dashboard-about-kyc-dropdown">
                    <MDBBtn
                        size="xs"
                        color="info"
                        v-on:click="kycDropdown = !kycDropdown"
                        class="dropdown-toggle"
                    >
                        <MDBIcon class="me-1" size="sm" icon="scroll" iconStyle="fas" />{{ t('default.kyc')}}
                    </MDBBtn>
                    <MDBDropdown v-model="kycDropdown" target="#dashboard-about-kyc-dropdown">
                        <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
                            <MDBDropdownItem v-if="kycStatus" :href="kycStatus" newTab>
                                {{ t("default.legal_status") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                            </MDBDropdownItem>
                            <MDBDropdownItem v-if="kycDocument" :href="kycDocument" newTab>
                                {{ t("default.legal_document") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                            </MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBBtnGroup>
            </li>
            <li v-if="socialTwitter || socialFacebook" class="list-inline-item mb-1">
                <MDBBtnGroup id="dashboard-about-social-dropdown">
                    <MDBBtn
                        size="xs"
                        color="info"
                        v-on:click="socialDropdown = !socialDropdown"
                        class="dropdown-toggle"
                    >
                        <MDBIcon class="me-1" size="sm" icon="users" iconStyle="fas" />{{ t('default.social')}}
                    </MDBBtn>
                    <MDBDropdown v-model="socialDropdown" target="#dashboard-about-social-dropdown">
                        <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
                            <MDBDropdownItem v-if="socialTwitter" :href="socialTwitter" newTab>
                                Twitter<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                            </MDBDropdownItem>
                            <MDBDropdownItem v-if="socialFacebook" :href="socialFacebook" newTab>
                                Facebook<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                            </MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBBtnGroup>
            </li>
            <li v-if="chatDiscord" class="list-inline-item mb-1">
                <MDBBtnGroup id="dashboard-about-chat-dropdown">
                    <MDBBtn
                        size="xs"
                        color="info"
                        v-on:click="chatDropdown = !chatDropdown"
                        class="dropdown-toggle"
                    >
                        <MDBIcon class="me-1" size="sm" icon="comments" iconStyle="fas" />{{ t('default.chat')}}
                    </MDBBtn>
                    <MDBDropdown v-model="chatDropdown" target="#dashboard-about-chat-dropdown">
                        <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
                            <MDBDropdownItem v-if="chatDiscord" :href="chatDiscord" newTab>
                                Discord<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                            </MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBBtnGroup>
            </li>
        </ul>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { MDBIcon, MDBBtnGroup, MDBBtn, MDBDropdown, MDBDropdownMenu, MDBDropdownItem } from 'mdb-vue-ui-kit'
import { useLinks, useStats, useVuex } from "@/hooks/dao";

export default {
    components: {
        MDBIcon,
        MDBBtnGroup, MDBBtn, MDBDropdown, MDBDropdownMenu, MDBDropdownItem,
    },
    props: {
        dao: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const { t, n } = useI18n()

        const {
            web, whitepaper, wiki, sourceCode,
            kycStatus, kycDocument,
            socialTwitter, socialFacebook,
            chatDiscord
        } = useLinks(props.dao)

        const {
            users
        } = useStats(props.dao)

        const { walletUrl } = useVuex()

        const kycDropdown = ref(false)
        const socialDropdown = ref(false)
        const chatDropdown = ref(false)

        return {
            t, n,
            users,
            web, whitepaper, wiki, sourceCode,
            kycStatus, kycDocument,
            socialTwitter, socialFacebook,
            chatDiscord,
            walletUrl,
            kycDropdown, socialDropdown, chatDropdown,
        }
    }
}
</script>

<style scoped>
.btn-xs {
    padding: .3rem .5rem .3rem .5rem;
    font-size: .60rem;
    line-height: 1.3;
}
</style>