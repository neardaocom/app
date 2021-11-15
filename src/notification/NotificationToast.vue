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
import { reactive, watch } from 'vue'
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
            console.log( notifications.list.filter(el => !(el.visible === false && el.shown === true)))
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
        },

        showNotifications(){
            this.$nextTick(function(){            
                console.log(this.notifications.list)
                this.notifications.list.forEach( (el, i ,a) => {
                    a[i].visible = true;
                    a[i].shown = true;
                })
            })

        }
    },

    // watch: {
    //     notifications(n) {
    //         console.log(n);
    //         //this.notifications = this.notifications.filter(el => !(el.visible === false && el.shown === true))
    //         console.log(this.notifications);
    //     },
    // },   

    mounted() {
        emitter.on('addNotification', this.addNotification);
        emitter.on('showNotifications', this.showNotifications);
    },

}
</script>