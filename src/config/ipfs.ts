export type IPFSConfig = {
  token: string;
}

export const getConfig = (env: string): IPFSConfig => {
  if (
    process.env.VUE_APP_WEB3STORAGE_TOKEN === undefined
  ) {
    throw new Error("APP config undefined");
  }

  return {
    token: process.env.VUE_APP_WEB3STORAGE_TOKEN
  }
};