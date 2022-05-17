export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export const getConfig = (env: string): FirebaseConfig => {
  if (
    process.env.VUE_APP_FIREBASE_APIKEY === undefined
    || process.env.VUE_APP_FIREBASE_AUTH_DOMAIN === undefined
    || process.env.VUE_APP_FIREBASE_DATABASE_URL === undefined
    || process.env.VUE_APP_FIREBASE_PROJECT_ID === undefined
    || process.env.VUE_APP_FIREBASE_STORAGE_BUCKET === undefined
    || process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID === undefined
    || process.env.VUE_APP_FIREBASE_APP_ID === undefined
    || process.env.VUE_APP_FIREBASE_MEASUREMENT_ID === undefined
  ) {
    throw new Error("FIREBASE config undefined");
  }

  return {
    apiKey: process.env.VUE_APP_FIREBASE_APIKEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
  }
};