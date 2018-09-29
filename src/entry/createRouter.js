import Vue from 'vue'
import Router from 'vue-router'
import IntroComp from '../components/vueSSR/IntroComp.vue'

Vue.use(Router)

export function createRouter () {
    return new Router({
        routes: [
            {
                path: '/'
            },
            {
                path: '/intro',
                component: IntroComp
            }
        ]
    })
}