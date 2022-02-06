<template>
    <!-- <InputNumber labelName="Near"/> -->
    <InputNumber labelName="Near" id="inputNear" :balance="balance" :max="max" :min="min"/>
    <InputString labelName="ahoj" id="inputString" prepend="adf" addon="blabla"/>
    
</template>

<script>
import InputNumber from '@/components/forms/InputNumber.vue'
import InputString from '@/components/forms/InputString.vue'

import { computed } from '@vue/reactivity';
import Decimal from 'decimal.js'

export default {
    components: {
        InputNumber,
        InputString
    },
    setup () {
        const balance = computed(() => (new Decimal('1500000')))
        const max = computed(() => (new Decimal('15000')))
        const min = computed(() => (new Decimal('0')))
        return {
            balance,
            max,
            min
        }
    }
}
</script>