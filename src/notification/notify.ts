import { emitter } from './events';

const emit = (title: string, message: string, color: string) => {
    emitter.emit('addNotification', {title: title, message: message, color: color});
}

export const notify = {
    
    addSuccess(title: string, message: string){
        emit(title, message, "success")
    },

    addInfo(title: string, message: string){
        emit(title, message, "info")
    },

    addWarning(title: string, message: string){
        emit(title, message, "warning")
    },

    addDanger(title: string, message: string){
        emit(title, message, "danger")
    },

    show(){
        emitter.emit('showNotifications')
    }

}