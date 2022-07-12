<template>
   <div>
         <ul class="list-inline mb-2">
            <li v-if="webLink" class="list-inline-item mb-1">
               <a :href="webLink" class="btn btn-info btn-xs" target="_blank">
                     <MDBIcon class="me-1" size="sm" icon="globe" iconStyle="fas" />{{ t('web') }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
               </a>
            </li>
            <li v-if="wikiLink" class="list-inline-item mb-1">
               <a :href="wikiLink" class="btn btn-info btn-xs" target="_blank">
                     <MDBIcon class="me-1" size="sm" icon="database" iconStyle="fas" />{{ t("wiki") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
               </a>
            </li>
            <li v-if="whitepaperLink" class="list-inline-item mb-1" >
               <a :href="whitepaperLink" class="btn btn-info btn-xs" target="_blank">
                     <MDBIcon class="me-1" size="sm" icon="book" iconStyle="fas" />{{ t("whitepaper") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
               </a>
            </li>
            <li v-if="sourceCodeLink" class="list-inline-item mb-1">
               <a :href="sourceCodeLink" class="btn btn-info btn-xs" target="_blank">
                     <MDBIcon class="me-1" size="sm" icon="file-code" iconStyle="fas" />{{ t("source_code") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
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
                        <MDBIcon class="me-1" size="sm" icon="scroll" iconStyle="fas" />{{ t('kyc')}}
                     </MDBBtn>
                     <MDBDropdown v-model="kycDropdown" target="#dashboard-about-kyc-dropdown">
                        <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
                           <MDBDropdownItem v-if="kycStatusLink" :href="kycStatusLink" newTab>
                                 {{ t("legal_status") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
                           </MDBDropdownItem>
                           <MDBDropdownItem v-if="kycDocumentLink" :href="kycDocumentLink" newTab>
                                 {{ t("legal_document") }}<MDBIcon class="ms-2" size="sm" icon="external-link-alt" iconStyle="fas" />
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
                        <MDBIcon class="me-1" size="sm" icon="users" iconStyle="fas" />{{ t('social')}}
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
                        <MDBIcon class="me-1" size="sm" icon="comments" iconStyle="fas" />{{ t('chat')}}
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
</template>

<script>
import { MDBIcon, MDBBtnGroup, MDBBtn, MDBDropdown, MDBDropdownMenu, MDBDropdownItem } from 'mdb-vue-ui-kit'
import { inject, ref } from '@vue/runtime-core'
import { useLinks } from "@/hooks/dao";
import { useResource } from "@/hooks/docs";
import { useNear } from "@/hooks/near";
import { useI18n } from 'vue-i18n';

   export default {
      components: {
         MDBIcon, MDBBtnGroup, MDBBtn, MDBDropdown, MDBDropdownMenu, MDBDropdownItem,
      },

      setup(){
         const { t } = useI18n()
         const dao = inject('dao')
         const config = inject('config')
         const loader = inject('loader')
         const ipfsService = loader.value.load('services/ipfs')

         const {
            web, whitepaper, wiki, sourceCode,
            kycStatus, kycDocument,
            socialTwitter, socialFacebook,
            chatDiscord
         } = useLinks(dao.value)

         const { daoResource } = useResource(ipfsService)

         const webLink = ref(null)
         if (web) daoResource.value.fetch(web).then(r => {webLink.value = r})
         const whitepaperLink = ref(null)
         if (whitepaper) daoResource.value.fetch(whitepaper).then(r => {whitepaperLink.value = r})
         const wikiLink = ref(null)
         if (wiki) daoResource.value.fetch(wiki).then(r => {wikiLink.value = r})
         const sourceCodeLink = ref(null)
         if (sourceCode) daoResource.value.fetch(sourceCode).then(r => {sourceCodeLink.value = r})
         const kycStatusLink = ref(null)
         if (kycStatus) daoResource.value.fetch(kycStatus).then(r => {kycStatusLink.value = r})
         const kycDocumentLink = ref(null)
         if (kycDocument) daoResource.value.fetch(kycDocument).then(r => {kycDocumentLink.value = r})
         const socialTwitterLink = ref(null)
         if (socialTwitter) daoResource.value.fetch(socialTwitter).then(r => {socialTwitterLink.value = r})
         const socialFacebookLink = ref(null)
         if (socialFacebook) daoResource.value.fetch(socialFacebook).then(r => {socialFacebookLink.value = r})
         const chatDiscordLink = ref(null)
         if (chatDiscord) daoResource.value.fetch(chatDiscord).then(r => {chatDiscordLink.value = r})

         const { walletUrl } = useNear(config)

         const kycDropdown = ref(false)
         const socialDropdown = ref(false)
         const chatDropdown = ref(false)

         return{
            t, web, whitepaper, wiki, sourceCode,
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
