import { createApp } from './vueSSR'

// 服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。此时，除了创建和返回应用程序实例之外，它还将在此执行服务器端路由匹配(server-side route matching)和数据预取逻辑(data pre-fetching logic)。
export default context => {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()
    // vue-router实例，也等同于this.$router.push
    router.push(context.url)
    // 等到 vue-router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      // Promise 应该 resolve 应用程序实例，以便它可以渲染
      resolve(app)
    }, reject)
  })
}