import mitt from 'mitt';

type EventType = {
    addNotification: {title: string, message: string, color: string};
    showNotifications?: any;
}

export const emitter = mitt<EventType>();
