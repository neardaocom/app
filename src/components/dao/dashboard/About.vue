<template>
    <div class="card text-start w-auto p-2" style="width: 18rem">
        <div class="card-body">
        <h5><i class="bi bi-people text-secondary"/> {{dao.name}}</h5>
        <ul class="list-unstyled mb-1">
            <li>
                <i class="bi bi-wallet2 me-2"/> 
                <a
                    class="text-reset "
                    :href="walletUrl + '/accounts/' + dao.wallet"
                    target="_blank"
                >
                    {{ dao.wallet }} <i class="bi bi-box-arrow-up-right ms-1"/>
                </a>
            </li>
            <li>
                <i class="bi bi-people me-2"/>
                <span class="text-reset font-weight-bold">{{ n(users) }}</span> {{ t('default.members') }}
            </li>
            <li v-if="false">
                <i class="fas fa-money-bill-wave-alt fa-fw me-3 mb-3"/>
                <span class="text-reset font-weight-bold">{{ n(dao.treasury.token.meta.amount) }}</span> {{ dao.treasury.token.meta.name }}
            </li>
        </ul>
        <ul class="list-inline mb-2">
            <li v-if="webLink" class="list-inline-item mb-1">
                <a :href="webLink" class="btn btn-info btn-xs" target="_blank">
                    <MDBIcon class="me-1" size="sm" icon="globe" iconStyle="fas" />{{ t('default.web') }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                </a>
            </li>
            <li v-if="wikiLink" class="list-inline-item mb-1">
                <a :href="wikiLink" class="btn btn-info btn-xs" target="_blank">
                    <MDBIcon class="me-1" size="sm" icon="database" iconStyle="fas" />{{ t("default.wiki") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                </a>
            </li>
            <li v-if="whitepaperLink" class="list-inline-item mb-1" >
                <a :href="whitepaperLink" class="btn btn-info btn-xs" target="_blank">
                    <MDBIcon class="me-1" size="sm" icon="book" iconStyle="fas" />{{ t("default.whitepaper") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                </a>
            </li>
            <li v-if="sourceCodeLink" class="list-inline-item mb-1">
                <a :href="sourceCodeLink" class="btn btn-info btn-xs" target="_blank">
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
                            <MDBDropdownItem v-if="kycStatusLink" :href="kycStatusLink" newTab>
                                {{ t("default.legal_status") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                            </MDBDropdownItem>
                            <MDBDropdownItem v-if="kycDocumentLink" :href="kycDocumentLink" newTab>
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
                            <MDBDropdownItem v-if="socialTwitterLink" :href="socialTwitterLink" newTab>
                                Twitter<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                            </MDBDropdownItem>
                            <MDBDropdownItem v-if="socialFacebookLink" :href="socialFacebookLink" newTab>
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
                            <MDBDropdownItem v-if="chatDiscordLink" :href="chatDiscordLink" newTab>
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
import { useLinks, useStats } from "@/hooks/dao";
import { useIPFS, useNear } from "@/hooks/vuex";
import { fetch } from "@/models/ipfs";

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

        const { ipfsService } = useIPFS()

        const {
            web, whitepaper, wiki, sourceCode,
            kycStatus, kycDocument,
            socialTwitter, socialFacebook,
            chatDiscord
        } = useLinks(props.dao)

        const webLink = ref(null)
        if (web) fetch(web, ipfsService.value).then(r => {webLink.value = r})
        const whitepaperLink = ref(null)
        if (whitepaper) fetch(whitepaper, ipfsService.value).then(r => {whitepaperLink.value = r})
        const wikiLink = ref(null)
        if (wiki) fetch(wiki, ipfsService.value).then(r => {wikiLink.value = r})
        const sourceCodeLink = ref(null)
        if (sourceCode) fetch(sourceCode, ipfsService.value).then(r => {sourceCodeLink.value = r})
        const kycStatusLink = ref(null)
        if (kycStatus) fetch(kycStatus, ipfsService.value).then(r => {kycStatusLink.value = r})
        const kycDocumentLink = ref(null)
        if (kycDocument) fetch(kycDocument, ipfsService.value).then(r => {kycDocumentLink.value = r})
        const socialTwitterLink = ref(null)
        if (socialTwitter) fetch(socialTwitter, ipfsService.value).then(r => {socialTwitterLink.value = r})
        const socialFacebookLink = ref(null)
        if (socialFacebook) fetch(socialFacebook, ipfsService.value).then(r => {socialFacebookLink.value = r})
        const chatDiscordLink = ref(null)
        if (chatDiscord) fetch(chatDiscord, ipfsService.value).then(r => {chatDiscordLink.value = r})

        const {
            users
        } = useStats(props.dao)

        const { walletUrl } = useNear()

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
            webLink, whitepaperLink, wikiLink, sourceCodeLink,
            kycStatusLink, kycDocumentLink,
            socialTwitterLink, socialFacebookLink,
            chatDiscordLink,
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