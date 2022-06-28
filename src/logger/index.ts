import { collection, addDoc } from "firebase/firestore"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import loToString from "lodash/toString"
import sha256 from 'crypto-js/sha256'
import { useAuthStore } from "@/store/auth";
import { useServiceStore } from "@/store/service";

export default {

    install: (app: any) =>  {

        const firestoreLog = async (lvl: string, target: string, action: string, level: string, message: string) => {
            const authStore = useAuthStore()
            const serviceStore = useServiceStore()
            const db = serviceStore.firebase!.getFirestore()

            const walletHash = authStore.isLoggedIn ? sha256(authStore.accountId).toString() : sha256( loToString(process.env.VUE_APP_DAO_DEFAULT).split('.').slice(-2).join('.')).toString()
            const correlationId = walletHash.substr(0, walletHash.length / 2);
            //const walletHash = authStore.isLoggedIn ? authStore.accountId : loToString(process.env.VUE_APP_DAO_DEFAULT).split('.').slice(-2).join('.')
            //const correlationId = walletHash;
            return await addDoc(collection(db, "logs"), {
                x_correlation_id: correlationId,
                x_lvl: lvl,
                x_target: target,
                x_action: action,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                level: level,
                message: message
            });
        }

        const logger = {

            /**
             * System is unusable.
             */
            emergency(lvl: string, target: string, action: string, message: string) {
                firestoreLog(lvl, target, action, 'emergency', message)
            },

            /**
             * Action must be taken immediately.
             *
             * Example: Entire website down, database unavailable, etc. This should
             * trigger the SMS alerts and wake you up.
             */            
            alert(lvl: string, target: string, action: string, message: string){
                firestoreLog(lvl, target, action, 'alert', message)
            },

            /**
             * Critical conditions.
             *
             * Example: Application component unavailable, unexpected exception.
             */
            critical(lvl: string, target: string, action: string, message: string){
                firestoreLog(lvl, target, action, 'critical', message)
            },

            /**
             * Runtime errors that do not require immediate action but should typically
             * be logged and monitored.
             */
            error(lvl: string, target: string, action: string, message: string){
                firestoreLog(lvl, target, action, 'error', message)
            },

            /**
             * Exceptional occurrences that are not errors.
             *
             * Example: Use of deprecated APIs, poor use of an API, undesirable things
             * that are not necessarily wrong.
             */
            warning(lvl: string, target: string, action: string, message: string){
                firestoreLog(lvl, target, action, 'warning', message)
            },

            /**
             * Normal but significant events.
             */
            notice(lvl: string, target: string, action: string, message: string){
                firestoreLog(lvl, target, action, 'notice', message)
            },

            /**
             * Interesting events.
             *
             * Example: User logs in, SQL logs.
             */
            info(lvl: string, target: string, action: string, message: string){
                firestoreLog(lvl, target, action, 'info', message)
            },

            /**
             * Detailed debug information.
             */
            debug(lvl: string, target: string, action: string, message: string){
                firestoreLog(lvl, target, action, 'debug', message)
            }
        }

        app.config.globalProperties.$logger = logger
        app.provide('logger', logger)
    }
}