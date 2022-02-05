import { computed } from "vue";
import { useStore } from 'vuex';

export const useIPFSService = () => {
    const store = useStore()
    const ipfsService = computed(() => store.getters['ipfs/getService'])

    return ipfsService
}