<template>
    <section class="d-flex flex-column justify-content-center w-100">
        <div class="p-1" :class="(collapse && isClose) ? 'overflow-hidden collapsed-height' : ''" v-html="content"></div>
        <div v-if="collapse" class="p-0 pt-0" >
            <hr v-if="isClose" class="mt-0 mb-1">
            <a style="link-dark pe-auto" href="#" @click.prevent="toggle()"><MDBIcon class="px-2" :icon="icon" iconStyle="fas" /></a>
        </div>
    </section>
</template>
<script>
import { MDBIcon } from "mdb-vue-ui-kit"
import { ref, toRefs } from "vue"
import { getWords } from "@/utils/string"
export default {
    components: {
        MDBIcon
    },
    props: {
        content: {
            type: String,
            required: true,
        },
        limit: {
            type: Number,
            required: false,
            default: 20,
        },
    },
    setup(props) {
        const {content} = toRefs(props)
        const isClose = ref(true)
        const wordCount = getWords(content.value).length
        console.log(getWords(content.value))
        
        return { isClose, wordCount }
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
            return this.wordCount >= this.limit
        }
    }
}
</script>
<style>

.collapsed-height {
    height: 70px;
}

</style>