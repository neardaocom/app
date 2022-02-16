<template>
<section>
       <!-- Background image -->
        <div class="bg-image title_baground_image">
          <div class="mask title_baground_mask">
            <div class="d-flex justify-content-center align-items-center h-100">
              <div class="text-white">
                <img height="35" width="140" src="/img/near_logo.svg" alt="Near logo" />
                <h1 class="mb-2"><strong>{{dao.name}}</strong></h1>
                <h6 class="mb-2">{{dao.purpose}}</h6>                   
              </div>
            </div>
          </div>
        </div>
        <!-- Background image -->
  </section>
</template>

<script>
export default {
  components: {
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
  }
};
</script>