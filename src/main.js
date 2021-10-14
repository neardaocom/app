import 'mdb-vue-ui-kit/css/mdb.min.css'
import 'mdb-vue-file-upload/css/mdb-vue-file-upload.min.css';
import 'mdb-vue-wysiwyg-editor/css/mdb-vue-wysiwyg-editor.min.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVi5NW32POIWYVRDdy38Qy7V97IIx5lhI",
  authDomain: "fir-66a56.firebaseapp.com",
  projectId: "fir-66a56",
  storageBucket: "fir-66a56.appspot.com",
  messagingSenderId: "600663441216",
  appId: "1:600663441216:web:aa32e3411e3c395a5644a5",
  measurementId: "G-5PBHWER1C7"
};

// Initialize Firebase
initializeApp(firebaseConfig);

import { getAnalytics, logEvent } from "firebase/analytics";

const analytics = getAnalytics();
logEvent(analytics, 'notification_received');

const app = createApp(App);
app.use(i18n);
app.use(store);
app.use(router);
app.mount('#app');