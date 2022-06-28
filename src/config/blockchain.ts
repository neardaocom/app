export type BlockchainConfig = {
  skywardFinanceContract: string;
  skywardFinanceTokenId: string;
}

export const getConfig = (env: string): BlockchainConfig => {
  if (
    process.env.VUE_APP_SKYWARD_FINANCE_CONTRACT === undefined
    || process.env.VUE_APP_SKYWARD_FINANCE_TOKEN_ID === undefined
  ) {
    throw new Error("APP config undefined");
  }

  return {
    skywardFinanceContract: process.env.VUE_APP_SKYWARD_FINANCE_CONTRACT,
    skywardFinanceTokenId: process.env.VUE_APP_SKYWARD_FINANCE_TOKEN_ID,
  }
};