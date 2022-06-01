<template>
   <div class="d-flex justify-content-center text-start mb-5">
      <div> 
         <h6> {{ header }} </h6>
         <div class="border-start border-secondary border-3 ps-2">
            <InfoAmount :amount="amount" :suffix="suffix" suffixColor="secondary" class="fs-2 fw-800"/> 
            <slot></slot>
         </div>
      </div>
   </div>
</template>

<script>
import InfoAmount from '@/components/ui/InfoAmount.vue'

export default {
   props:{
      header:{
         type: String,
         required: false,
      },
      amount:{
         type: [Object, Number, String],
         required: false,
      },
      suffix:{
         type: String,
         required: false,
      },
   },
   components:{
      InfoAmount
   },
   setup () {
      

      return {}
   }
}
</script>