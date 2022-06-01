<template>
   <span>
      <NumberFormatter :class="`text-${amountColor}`" :amount="amount"/>
      <span :class="[`text-${suffixColor}`, { 'fw-normal': suffixNormal }]" :style="`font-size:${suffixSize}%`">{{suffix}}</span>
   </span>
</template>

<script>
import NumberFormatter from '@/components/ui/NumberFormatter.vue'
export default {
   components:{
      NumberFormatter
   },
   props:{
      amount: {
         type: [Object, Number, String],
         required: false,
      },
      suffix:{
         type: String,
         required: true
      },
      amountColor:{
         type: String,
         required: false,
         default: 'reset'
      },
      suffixColor:{
         type: String,
         required: false,
         default: 'reset'
      },
      suffixSize: {
         type: Number,
         required: false,
         default: 75
      },
      suffixNormal:{
         type: Boolean,
         required: false,
         default: false
      },
   },
   setup () {
      
      return {}
   }
}
</script>