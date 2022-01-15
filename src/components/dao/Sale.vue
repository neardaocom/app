<template>
 <MDBCard text="start">
    <MDBCardHeader>{{`${t('default.reffinance')} ${t('default.pool')}`}}</MDBCardHeader>
    <MDBCardBody>
        <MDBCardTitle>
            <a :href="sale.url" target="_blank">{{`${t('default.pool')} ${sale.id}`}} </a>
        </MDBCardTitle>
        <div class="d-flex justify-content-between">
            <h4>{{ daoTokenName}}</h4> 
            {{amountDaoToken}}
        </div>
        <div class="d-flex justify-content-between">
            <h4>{{ tokenName }}</h4> 
            {{amountNear}}
        </div>
        <hr class="mt-0 mb-3"/>
        <MDBCardText>
            <div class="d-flex justify-content-between">
                <h6>{{t('default.fee')}}</h6> 
                {{sale.fee / 100}}
            </div>
            <div class="d-flex justify-content-between">
                <h6>{{t('default.total_shares')}}</h6> 
                {{ n(+totalShares, { notation: 'compact' }) }}
            </div>
            <div class="d-flex justify-content-between">
                <h6>{{t('default.shares')}}</h6> 
                {{ sale.total_shares ? `${(sale.shares / sale.total_shares) * 100}%` : '0%'}}
            </div>
        </MDBCardText>
    </MDBCardBody>
    <MDBCardFooter>
        <div class="d-flex justify-content-center align-self-end">
            <MDBBtn @click="modalAddLiquidityOpen" color="primary">{{t('default.add_liquidity')}}</MDBBtn>
            <MDBBtn @click="modalRemoveLiquidityOpen" color="primary">{{t('default.remove_liquidity')}}</MDBBtn>
        </div>
    </MDBCardFooter>                  
</MDBCard>
    
    <ModalAddLiquidity :show="modalAddLiquidity" :contractId="dao.wallet" :sale="sale" :maxNear="dao.treasury.near" :maxToken="dao.token_stats.public.free" :tokensNames="[daoTokenName, tokenName]" :tokenDecimals="dao.token_stats.decimals" />
    <ModalRemoveLiquidity :show="modalRemoveLiquidity" :contractId="dao.wallet" :sale="sale" :tokenDecimals="dao.token_stats.decimals" :maxShares="+totalShares" />
</template>
<script>
    import { onMounted, ref, toRefs } from "vue";
    import { useI18n } from "vue-i18n";
    import { yoctoNear } from '@/services/nearService'
    import Decimal from 'decimal.js'
    import Sale from "@/components/dao/Sale.vue"
    import { MDBCard,
        MDBCardHeader,
        MDBCardBody,
        MDBCardText,
        MDBCardTitle,
        MDBBtn,
        MDBCardFooter
    } from "mdb-vue-ui-kit";
    import ModalAddLiquidity from "@/components/dao/ModalAddLiquidity.vue";
    import ModalRemoveLiquidity from "@/components/dao/ModalRemoveLiquidity.vue";
    import { GeneralTokenService } from '@/services/generalTokenService';

    export default {
        components: {
            MDBCard,
            MDBCardHeader,
            MDBCardText,
            MDBCardBody,
            MDBCardTitle,
            MDBBtn,
            MDBCardFooter,
            ModalAddLiquidity,
            ModalRemoveLiquidity
        },
        props: {
            sale: {
                type: Sale,
                required: true,
            },
            dao: {
                type: Object,
                required: true,
            },
            nearService: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const {sale, nearService, dao} = toRefs(props)
            const { t, n } = useI18n();
            const modalAddLiquidity = ref(0)
            const modalRemoveLiquidity = ref(0)

            const generalTokenService = ref(null)
            const tokenMetadata = ref(null)

            const fetchTokenName = async () => {
                tokenMetadata.value = await generalTokenService.value.getFtMetadata()
            }

            onMounted(() => {
                nearService.value.getNear().account(dao.value.wallet).then( account => {
                    generalTokenService.value = new GeneralTokenService(account, sale.value.token_account_ids[1])
                    fetchTokenName()
                })
            })
            return {
                t, n,
                modalAddLiquidity,
                modalRemoveLiquidity,
                tokenMetadata
            }
        },

        methods:{
            modalAddLiquidityOpen() {
                this.modalAddLiquidity += 1
            },
            modalRemoveLiquidityOpen() {
                this.modalRemoveLiquidity += 1
            },
        },
        computed: {
            amountNear(){
                return new Decimal(this.sale.amounts[1] || 0).dividedBy(yoctoNear).toNumber()
            },
            amountDaoToken(){
                return  new Decimal(this.sale.amounts[0]  || 0).dividedBy(10 ** this.dao.token_stats.decimals).toNumber()
            },
            totalShares(){
                return new Decimal( this.sale.total_shares || 0).toFixed()
            },
            daoTokenName(){
                return this.dao.token_name
            },
            tokenName(){
                return this.tokenMetadata ? this.tokenMetadata['symbol'] : this.sale.token_account_ids[1]
            }
        }
    }
</script>