<template>
  <MDBInput
    inputGroup
    formOutline
    wrapperClass="my_filter_form"
    v-model="query"
    size="sm"
    aria-describedby="search-addon"
    :aria-label="t('default.search')"
  >
    <template #prepend>
      <span class="input-group-text border-0" id="search-addon"
        ><MDBIcon icon="search" iconStyle="fas"
      /></span>
    </template>
  </MDBInput>
</template>

<script>
import { MDBInput, MDBIcon } from "mdb-vue-ui-kit";
import { ref, toRefs, watchEffect } from "vue"
import { useI18n } from "vue-i18n"

export default {
    components: {
        MDBInput, MDBIcon,
    },
    props: {
        modelValue: {
            type: String,
            required: false,
        }
    },
    setup(props, {emit}) {
        const { modalValue } = toRefs(props)
        const { t } = useI18n();

        const query = ref(modalValue)

        watchEffect(() => {
            emit('update:modelValue', query.value)
        })

        return { t, query }
    }
}
</script>