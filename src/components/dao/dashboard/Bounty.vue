<template>
    <div v-if="bounties.length > 0" class="col-12 col-md-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
            <div class="card-body">
                <h5> <i class="bi bi-cash-coin color-primary me-2"></i>{{ t("default.wf_templ_wf_bounty") }}</h5>
                <ul v-for="(title, index) in titles" :key="index">
                    <li>
                        <span v-html="title"></span>
                        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'activities', search: '#' + proposals[index].id }}" class="btn btn-outline-secondary btn-rounded btn-sm ms-1">{{ t('default.apply') }}</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, onUnmounted, toRefs } from "vue"
import { useBounties } from "@/hooks/bounty"
import { useI18n } from 'vue-i18n'

export default {
    components: {
    },
    props: {
        dao: {
            type: Object,
            required: true,
        }
    },
    setup(props) {
        const { dao } = toRefs(props)
        const { t, d, n } = useI18n()

        const {
            bounties, proposals, titles,
        } = useBounties(dao.value, t, d, n)


        onMounted(() => {
            
        })

        onUnmounted(() => {

        })

        return {
            t, bounties, proposals, titles
        }
    },
}
</script>