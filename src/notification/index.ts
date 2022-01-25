import NotificationToast from "./NotificationToast.vue"
import { notify } from "./notify"

export default {

    install: (app: any) =>  {
        
        app.config.globalProperties.$notify = notify;
        app.provide('notify', notify)
        app.component("NotificationToast", NotificationToast)
    }
}