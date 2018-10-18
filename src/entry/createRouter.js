import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/vueSSR/Home.vue'
import IntroMe from '../components/vueSSR/IntroMe.vue'
import IntroComp from '../components/vueSSR/IntroComp.vue'

Vue.use(Router)

export function createRouter () {
    return new Router({
        mode: 'history',
        routes: [
            {
                path: '/vuessr',
                component: Home
            },
            {
                path: '/me',
                component: IntroMe
            },
            {
                path: '/intro',
                component: IntroComp
            }
        ]
    })
}