import { emitter } from './events';

const push = (title: string, message: string, color: string) => {
    emitter.emit('addNotification', {title: title, message: message, color: color});
}

export const notify = {
    
    success(title: string, message: string){
        push(title, message, "success")
    },

    info(title: string, message: string){
        push(title, message, "info")
    },

    warning(title: string, message: string){
        push(title, message, "warning")
    },

    danger(title: string, message: string){
        push(title, message, "danger")
    },

    flush(){
        emitter.emit('showNotifications')
    }

}