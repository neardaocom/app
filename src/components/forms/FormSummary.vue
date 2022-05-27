<template>
    <dt class="col-6 col-md-6 ps-3">{{name}}:</dt>
    <dd  v-if="value || value === 0 || value === '0'" class="text-end col-6 col-md-6">{{ value }}</dd>
    <dd v-else class="col-6 col-md-6"><span class="text-end text-danger">{{t('default.empty')}}</span> </dd>
</template>

<script>
import { useI18n } from 'vue-i18n'
export default {
    props:{
        name:{
            type: String,
            required: true
        },
        value:{
            type: [String, Number],
            required: false
        }
    },
    setup () {
        const {t} = useI18n()

        return {
            t
        }
    }
}
</script>
