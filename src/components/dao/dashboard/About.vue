<template>
    <div class="card text-start w-auto p-2">
        <div class="card-body">
            <div class="d-flex">
                <h6 class="text-muted">
                    {{t('default.dao')}}
                </h6>
                <Tooltip class="ms-auto" text="Tooltip" />
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex  align-items-center">
                    <Icon icon="NEAR" :size="45"/>
                    <div class="text-start">
                        <div class="fs-5 fw-bold me-1">{{dao.name}}</div>
                        <div class="text-muted small mt-n2">{{ dao.wallet }}</div>
                    </div>
                </div>

                <div class="text-muted small">
                {{t('default.wallet')}} 
                <MDBBadge tag="a" :href="walletUrl + '/accounts/' + dao.wallet" color="info" pill style="padding: 0.4rem"><i class="bi bi-wallet2"/></MDBBadge>
                </div>
            </div>

            <div class="fw-bold mb-2">
                <i class="bi bi-people me-2 text-info"/>{{ n(users) }} {{ t('default.members')}}<br/>
                <i class="bi bi-diagram-3 me-2 text-info"/>
                <template v-for="(group, index) in groupNames" :key="index">
                    <span v-if="index > 0"> | </span>{{ group }}
                </template>
            </div>


            <div>
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
            <div v-show="false" class="float-end mt-3">
                <MDBBtn tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'about' }}" size="sm" style="width: 120px"  color="primary" rounded> {{ t('default.about') }} </MDBBtn>
            </div>
        </div>
    </div>
</template>

<script>
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { MDBIcon, MDBBtnGroup, MDBBtn, MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBBadge } from 'mdb-vue-ui-kit'
import { useLinks, useStats } from "@/hooks/dao";
import { useIPFS, useNear } from "@/hooks/vuex";
import { fetch } from "@/models/ipfs";
import Icon from '@/components/ui/Icon.vue'
import Tooltip from '@/components/ui//Tooltip.vue'

export default {
    components: {
        MDBIcon,
        MDBBtnGroup, MDBBtn, MDBDropdown, MDBDropdownMenu, MDBDropdownItem,
        MDBBadge,
        Icon,
        Tooltip
    },
    setup() {
        const { t, n } = useI18n()
        const dao = inject('dao')
        const { ipfsService } = useIPFS()

        const {
            web, whitepaper, wiki, sourceCode,
            kycStatus, kycDocument,
            socialTwitter, socialFacebook,
            chatDiscord
        } = useLinks(dao.value)

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
            users, groupNames
        } = useStats(dao)

        const { walletUrl } = useNear()

        const kycDropdown = ref(false)
        const socialDropdown = ref(false)
        const chatDropdown = ref(false)

        return {
            dao, t, n,
            users, groupNames,
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