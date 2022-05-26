import { Ref, computed } from "vue";
import { Loader } from "@/loader";

export const useWallet = (loader: Ref<Loader>) => {
    const wallet = computed(() => loader.value.load('near/WalletConnection').value)
    
    return { wallet }
}