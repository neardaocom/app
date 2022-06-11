<template>
   <div class="text-center">
      <h1><i class="bi bi-file-earmark-x"/></h1>
      <h3>{{text}}</h3>
      <h6 class="text-muted">{{hint}}</h6>
   </div>   
</template>

<script>
export default {
   props:{
      text:{
         type: String,
         required: true
      },
      hint: {
         type: String,
         required: false
      }
   },
   setup () {
      return {}
   }
}
</script>