<template>
 <MDBCard text="start">
    <MDBCardHeader>{{`${t('default.reffinance')} ${t('default.pool')}`}}</MDBCardHeader>
    <MDBCardBody>
        <MDBCardTitle>
            <a :href="sale.url" target="_blank">{{`${t('default.pool')} ${sale.id}`}} </a>
        </MDBCardTitle>
        <div class="d-flex justify-content-between">
            <h4>{{ sale.token_account_ids[0]}}</h4> 
            {{sale.amounts[0]}}
        </div>
        <div class="d-flex justify-content-between">
            <h4>{{ sale.token_account_ids[1]}}</h4> 
            {{sale.amounts[1]}}
        </div>
        <hr class="mt-0 mb-3"/>
        <MDBCardText>
            <div class="d-flex justify-content-between">
                <h6>{{t('default.fee')}}</h6> 
                {{sale.fee / 100}}
            </div>
            <div class="d-flex justify-content-between">
                <h6>{{t('default.total_shares')}}</h6> 
                {{sale.total_shares}}
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
    
    <ModalAddLiquidity :show="modalAddLiquidity" :contractId="dao.wallet" :sale="sale" :tokenDecimals="dao.token_stats.decimals" />
    <ModalRemoveLiquidity :show="modalRemoveLiquidity" :contractId="dao.wallet" :sale="sale" :tokenDecimals="dao.token_stats.decimals" />
</template>
<script>
    import { ref } from "vue";
    import { useI18n } from "vue-i18n";
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
        },
        setup() {
            const { t } = useI18n();
            const modalAddLiquidity = ref(0)
            const modalRemoveLiquidity = ref(0)
            return {
                t,
                modalAddLiquidity,
                modalRemoveLiquidity
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
    }
</script>