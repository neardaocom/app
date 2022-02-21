<template>
    <div class="card text-start w-auto p-2" style="width: 18rem">
        <div class="card-body text-center">
        <h5 class="text-muted">{{ t("default.activity") }}</h5>
        <ul class="list-inline list-unstyled mb-0">
            <li class="list-inline-item me-3">
            <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'voting' }}" class="text-reset">
                <MDBIcon icon="vote-yea" size="2x"></MDBIcon><MDBBadge color="danger" pill notification>{{ dao.proposals.length }}</MDBBadge>
            </router-link>
            </li>
            <li class="list-inline-item ms-3">
            <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'documents' }}" class="text-reset">
                <MDBIcon icon="file-alt" size="2x"></MDBIcon><MDBBadge color="danger" pill notification>{{ dao.docs.files.length }}</MDBBadge>
            </router-link>
            </li>
        </ul>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { MDBIcon, MDBBadge } from 'mdb-vue-ui-kit'

export default {
    components: {
        MDBIcon, MDBBadge
    },
    props: {
        dao: {
            type: Object,
            required: true,
        },
    },
    setup() {
        const { t } = useI18n()

        return {
            t,
        }
    }
}
</script>