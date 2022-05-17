export type MarketConfig = {
  coinGectoUrl: string;
}

export const getConfig = (env: string): MarketConfig => {
  if (
    process.env.VUE_APP_COIN_GECKO_URL === undefined
  ) {
    throw new Error("APP config undefined");
  }

  return {
    coinGectoUrl: process.env.VUE_APP_COIN_GECKO_URL,
  }
};