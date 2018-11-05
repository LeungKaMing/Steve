import { createApp } from './vueSSR'

// 服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。此时，除了创建和返回应用程序实例之外，它还将在此执行服务器端路由匹配(server-side route matching)和数据预取逻辑(data pre-fetching logic)。
export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()
    // 调用 vue-router 的api来处理服务端传入的请求
    router.push(context.tempUrl)

    // 上面路由跳转有可能是异步的，这个方法就可以保证异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      Promise.all(matchedComponents.map((comp) => {
        // 1. 在所有预取钩子(preFetch hook) resolve 后，我们的 store 现在已经填充入渲染应用程序所需的状态。
        if (comp.asyncData) {
          return comp.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(()=>{
        // 2. 当我们将状态附加到上下文【context】，状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML【该情况仅仅针对非ssr入口意外以外的组件，即Home.vue是不能有window的，否则会报错】。
        context.state = store.state
        // 3. Promise 应该 resolve 应用程序实例，以便它可以渲染
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}