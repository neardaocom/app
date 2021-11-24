<template>
    <MDBToast
        v-for="(item, index) in notifications.list"
        v-model="item.visible"
        :key="index"
        position="top-right"
        appendToBody
        :autohide="false"
        stacking
        width="350px"
        :color="item.color"
        text="white"
    >
        <template #title>
            {{item.title}}
        </template>
        <template #small>
            <!-- {{item.message}} -->
        </template>
        {{item.message}}
    </MDBToast>
</template>

<script>
import { MDBToast } from 'mdb-vue-ui-kit'
import { reactive, watch, toRaw } from 'vue'
import { emitter } from './events';
import _ from "lodash";

export default {

    components: {
        MDBToast
    },

    setup () {
        const notifications = reactive({
                list: []
            })
        

        watch(() => _.cloneDeep(notifications.list), () => {
            notifications.list.forEach( (el, i ,a) => {
                if(el.visible === false && el.shown === true){
                    a.splice(i, 1)
                }
            })
        })

        return {notifications}

    },

    methods: {
        addNotification(args){
            this.notifications.list.push({visible: false, shown: false, ...args})
            this.setLocalStorage(false)
        },

        showNotifications(){
            this.$nextTick(function(){            
                this.notifications.list.forEach( (el, i ,a) => {
                    a[i].visible = true;
                    a[i].shown = true;
                })
            })
            this.setLocalStorage(true)
            
        },

        setLocalStorage(setEmpty){
            if(!setEmpty){
                const data = JSON.stringify(toRaw(this.notifications.list))
                localStorage.setItem('notifications', data);
            }else{
                localStorage.setItem('notifications', JSON.stringify([]))
            }
            
        }
    },

    mounted() {
        const ls = localStorage.getItem('notifications')
        if( ls !== ''){
            const parseLs = JSON.parse(ls)
            if(typeof parseLs === 'object' && parseLs !== null){
                this.notifications.list = reactive(parseLs)
            }
        }
        emitter.on('addNotification', this.addNotification);
        emitter.on('showNotifications', this.showNotifications);
    },

}
</script>