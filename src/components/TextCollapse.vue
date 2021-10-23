<template>
    <section class="d-flex flex-column justify-content-center w-100">
        <div ref="refContent" class="p-1" :class="(collapse && isClose) ? 'overflow-hidden collapsed-height' : ''" v-html="content"></div>
        <div v-if="collapse" class="p-0 pt-0" >
            <hr v-if="isClose" class="mt-0 mb-1">
            <a style="link-dark pe-auto" href="#" @click.prevent="toggle()"><MDBIcon class="px-2" :icon="icon" iconStyle="fas" /></a>
        </div>
    </section>
</template>
<script>
import { MDBIcon } from "mdb-vue-ui-kit"
import { ref } from "vue"
export default {
    components: {
        MDBIcon
    },
    props: {
        content: {
            type: String,
            required: true,
        }
    },
    setup() {
        const isClose = ref(true)
        const contentHeight = ref(0)

        return { isClose, contentHeight }
    },
    methods: {
        toggle() {
            this.isClose = !this.isClose
        }
    },
    computed: {
        icon() {
            return (this.isClose) ? 'angle-down' : 'angle-up'
        },
        collapse() {
            return this.contentHeight > 70
        }
    },
    mounted() {
        this.contentHeight = this.$refs.refContent.clientHeight
    }
}
</script>
<style>

.collapsed-height {
    max-height: 70px;
}

</style>