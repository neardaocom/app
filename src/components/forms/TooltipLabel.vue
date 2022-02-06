<template>
    <MDBTooltip v-model="tooltipShow">
        <template #reference>
            <MDBIcon icon="question-circle" iconStyle="far" />
        </template>
        <template #tip>
            {{ description }}
        </template>
    </MDBTooltip>
</template>

<script>
import {
    MDBTooltip,
    MDBIcon
} from "mdb-vue-ui-kit";
import { ref } from '@vue/reactivity';

export default {
    components:{
        MDBTooltip,
        MDBIcon
    },
    props:{
        description: {
            type: String,
            required: true 
        },
    },
    setup () {
        const tooltipShow = ref(false);
        return {tooltipShow}
    }
}
</script>
