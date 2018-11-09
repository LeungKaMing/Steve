import Vue from 'vue'
import App from '../pages/App.vue'
import {createRouter} from '../entry/createRouter'
import {createStore} from '../entry/createStore'
import { sync } from 'vuex-router-sync'
import * as ut from '../components/vueSSR/assets/scripts/utils'

Vue.use(ut)

// 导出一个工厂函数，用于创建新的应用程序、router 和 store 实例
export function createApp () {
  const router = createRouter()
  const store = createStore()

  // 同步路由状态(route state)到 store
  sync(store, router)

  // 创建应用程序实例，将 router 和 store 注入
  // * tips: store里面的dispath是对应action，commit是对应mutaion
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}
