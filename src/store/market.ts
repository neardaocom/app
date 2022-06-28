import { defineStore } from 'pinia'

export type CoinGeckoState = {
    nearPriceUsd: number | null
}

export const useCoinGeckoStore = defineStore('marketCoinGecko', {
  state: () => ({
    nearPriceUsd: null
  } as CoinGeckoState),
  actions: {
    setNearPriceUsd(price: number | null) {
      this.nearPriceUsd = price
    },
  },
})