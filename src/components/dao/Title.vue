<template>
  <section class="text-center mb-2">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-6 mt-4">
        <h1 class="fw-bolder">{{ dao.name }}</h1>
        <p class="fst-italic">{{ dao.slogan }}</p>
      </div>
    </div>
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