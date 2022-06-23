import { Ref, computed } from "vue";
import { Loader } from "@/loader";
import { Config } from "@/config";

export const useWallet = (loader: Ref<Loader>) => {
    const wallet = computed(() => loader.value.load('near/WalletConnection').value)
    
    return { wallet }
}

export const useWalletAuth = (loader: Ref<Loader>, config: Ref<Config>) => {
    const walletConnection = loader.value.load('near/WalletConnection')
    const isSignedIn = computed(() => walletConnection.value.isSignedIn() ?? false)
    const login = (successUrl?: string, errorUrl?: string) => {
        walletConnection.value.requestSignIn(config.value.near.domainAccountId, config.value.near.name, successUrl, errorUrl);
    }

    const logout = () => {
        walletConnection.value.signOut()
        window.location.assign('/')
    }

    return { walletConnection, isSignedIn, login, logout }
}