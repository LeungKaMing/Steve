import Vue from 'vue'
import App from '../pages/App.vue'
import {createRouter} from '../entry/createRouter'
// import {createStore} from '../entry/createStore'


// 导出一个工厂函数，用于创建新的应用程序、router 和 store 实例
export function createApp () {
  const router = createRouter()
  // const store = createStore()
  // 同步路由状态(route state)到 store
  // sync(store, router)

  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    router,
    // store,
    render: h => h(App)
  })
  return { app, router }
}
