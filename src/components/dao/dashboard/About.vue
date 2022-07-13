<template>
    <div class="card text-start w-auto p-2">
        <div class="card-body">
            <div class="d-flex">
                <h6 class="text-muted">
                    {{t('dao')}}
                </h6>
                <Tooltip class="ms-auto" :text="t('tooltip_dao_about')" />
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
                {{t('wallet')}} 
                <MDBBadge tag="a" :href="walletUrl + '/accounts/' + dao.wallet" color="info" pill style="padding: 0.4rem"><i class="bi bi-wallet2"/></MDBBadge>
                </div>
            </div>

            <div v-if="dataLoaded" class="d-flex justify-content-between fw-bold">
                <div>
                    <h6>{{t('dao_assets')}}</h6>
                    <div class="d-flex align-items-center mb-2">
                        <Icon icon="NEAR" :size="25"/>
                        <InfoAmount :amount="availableNearAmount" :suffix="treasuryNear.asset.symbol" suffixColor="muted"/>  
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <Icon :icon="treasuryToken.asset.icon" :size="25"/>
                        <InfoAmount :amount="availableTokenAmount" :suffix="treasuryToken.asset.symbol" suffixColor="muted"/>  
                    </div>
                    <div v-for="(ftAsset, index) in treasuryFtAssets" :key="index">
                        <div class="d-flex align-items-center mb-2">
                            <Icon :icon="ftAsset.asset.icon" :size="25"/>
                            <InfoAmount :amount="ftAsset.amount - ftAsset.amountLockedInLocks" :suffix="ftAsset.asset.symbol" suffixColor="muted"/>  
                        </div> 
                    </div>
                </div>

                <div v-if="walletTokenAmount > 0">
                    <h6>{{t('your_assets')}}</h6>
                    <div  class="mb-2">
                        <i class="bi bi-person me-2 text-info"/>
                        <InfoAmount :amount="walletTokenAmount" :suffix="dao.treasury.token.meta.symbol" suffixColor="muted"/> 
                        <span class="mx-2">|</span>
                        <InfoAmount :amount="walletTokenShare" :digits="0" suffix="%"/> 
                    </div>
                </div>
            </div>

            <ResourcesLinks class="mt-2"/>

            <div v-show="false" class="float-end mt-3">
                <MDBBtn tag="router-link" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'about' }}" size="sm" style="width: 120px"  color="primary" rounded> {{ t('about') }} </MDBBtn>
            </div>
        </div>
    </div>
</template>

<script>
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { MDBBtn, MDBBadge } from 'mdb-vue-ui-kit'
import Icon from '@/components/ui/Icon.vue'
import Tooltip from '@/components/ui//Tooltip.vue'
import { useStake } from '@/hooks/staking'
import InfoAmount from '@/components/ui/InfoAmount.vue'
import { useAnalytics } from '@/hooks/treasury';
import ResourcesLinks from '@/components/dao/dashboard/ResourcesLinks.vue'

export default {
    components: {
        MDBBtn,
        MDBBadge,
        Icon,
        Tooltip,
        InfoAmount,
        ResourcesLinks
    },
    setup() {
        const { t, n } = useI18n()
        const dao = inject('dao')
        const loader = inject('loader')
        const isDaoMember = inject('isDaoMember')
        const {
            dataLoaded, treasuryNear, treasuryToken,
            treasuryFtAssets, availableNearAmount,  availableTokenAmount 
        } = useAnalytics(dao, loader)

        const { walletTokenAmount, walletTokenShare } = useStake(dao)


        return {
            dao, t, n,
            isDaoMember, walletTokenShare, walletTokenAmount,
            dataLoaded, treasuryNear, treasuryToken, treasuryFtAssets, availableNearAmount,  availableTokenAmount 
        }
    }
}
</script>