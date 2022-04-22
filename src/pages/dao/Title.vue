<template>
<section>
       <!-- Background image -->
        <div class="bg-image title-background-image">
          <div class="mask">
            <div class="d-flex justify-content-center align-items-center h-100">
              <div class="">
                <img v-if="false" height="35" width="140" src="/img/near_logo.svg" alt="Near logo" />
                <h1 class="mb-2 text-dark" style="font-size: 3em;"><strong>{{dao.name}}</strong></h1>
                <h5 class="mb-2 text-dark">{{dao.purpose}}</h5>
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