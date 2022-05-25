<template>
      <div v-if="!icon" class="rounded-circle bg-black d-inline-block border border-secondary me-2" :style="{ height: size + 'px', width: size + 'px' }"/>
      <div v-else-if="icon.toLowerCase() === 'near'" class="d-flex rounded-circle bg-black d-inline-block border border-secondary me-2" :style="{ height: size + 'px', width: size + 'px' }">
         <img :src="'/img/near_logo.svg'" style=" padding:22%"/>
      </div>
      <img v-else :src="icon" class="img-fluid rounded-circle border border-secondary me-2" :style="{ height: size + 'px', width: size + 'px' }"/>
</template>

<script>
export default {
   props:{
      icon: {
         type: String,
         reguired: false
      },
      size:{
         type: Number,
         reguired: true
      }
   },
   setup () {
      return {}
   }
}
</script>