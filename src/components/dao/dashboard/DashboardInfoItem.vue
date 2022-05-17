<template>
   <div class="d-flex justify-content-center text-start mb-5">
      <div> 
         <h6> {{ header }} </h6>
         <NumberFormatter class="h2 border-start border-secondary border-3 ps-2" :amount="amount"/><span class="fs-5 text-secondary" style="font-weight: 800 !important;">{{suffix}}</span>
      </div>
   </div>
</template>

<script>
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
export default {
   props:{
      header:{
         type: String,
         required: false,
      },
      amount:{
         type: Number,
         required: false,
      },
      suffix:{
         type: String,
         required: false,
      },
   },
   components:{
      NumberFormatter
   },
   setup () {
      

      return {}
   }
}
</script>