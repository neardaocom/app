export type AppConfig = {
  baseUrl: string;
  daoDefault: string;
  brandName: string;
  brandAbout: string;
  brandAddress: string;
  brandEmail: string;
  brandWeb: string;
  brandTwitter: string;
  brandDiscord: string;
}

export const getConfig = (env: string): AppConfig => {
  if (
    process.env.BASE_URL === undefined
    || process.env.VUE_APP_DAO_DEFAULT === undefined
    || process.env.VUE_APP_BRAND_NAME === undefined
    || process.env.VUE_APP_BRAND_ABOUT === undefined
    || process.env.VUE_APP_BRAND_ADDRESS === undefined
    || process.env.VUE_APP_BRAND_EMAIL === undefined
    || process.env.VUE_APP_BRAND_WEB === undefined
    || process.env.VUE_APP_BRAND_TWITTER === undefined
    || process.env.VUE_APP_BRAND_DISCORD === undefined
  ) {
    throw new Error("APP config undefined");
  }

  return {
    baseUrl: process.env.BASE_URL,
    daoDefault: process.env.VUE_APP_DAO_DEFAULT,
    brandName: process.env.VUE_APP_BRAND_NAME,
    brandWeb: process.env.VUE_APP_BRAND_WEB,
    brandAbout: process.env.VUE_APP_BRAND_ABOUT,
    brandAddress: process.env.VUE_APP_BRAND_ADDRESS,
    brandEmail: process.env.VUE_APP_BRAND_EMAIL,
    brandTwitter: process.env.VUE_APP_BRAND_TWITTER,
    brandDiscord: process.env.VUE_APP_BRAND_DISCORD,
  }
};