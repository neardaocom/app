import 'mdb-vue-ui-kit/css/mdb.min.css'
import 'mdb-vue-file-upload/css/mdb-vue-file-upload.min.css';
import 'mdb-vue-wysiwyg-editor/css/mdb-vue-wysiwyg-editor.min.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import logger from './logger'
import notification from './notification';
import VeeValidatePlugin from './includes/validation';

const app = createApp(App);
app.use(i18n);
app.use(store);
app.use(router);
app.use(logger);
app.use(notification);
app.use(VeeValidatePlugin);
app.mount('#app');