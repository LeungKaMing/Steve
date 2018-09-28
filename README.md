# my-cli
## 已办
1. webpack基本配置模板
2. vue基本配置
3. react基本配置
## 前端待办
1. 引入状态管理：vuex，redux
2. 引入路由管理：vue-router，react-router
3. 异步状态管理
4. 高级路由用法
5. 同构：ssr
- vue ssr
```
优点：
1. 更好的 SEO
2. 更快的内容到达时间(time-to-content)，用户将会更快速地看到完整渲染的页面
缺点：
1. 开发条件所限。浏览器特定的代码，只能在某些生命周期钩子函数(lifecycle hook)中使用；一些外部扩展库(external library)可能需要特殊处理，才能在服务器渲染应用程序中运行。
2. 更多的服务器端负载。在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源(CPU-intensive - CPU 密集)，因此如果你预料在高流量环境(high traffic)下使用，请准备相应的服务器负载，并明智地采用缓存策略。
总结：
服务器端渲染(SSR)可以帮助你实现最佳的初始加载性能。
```
- vue prerender
> 只是用来改善少数营销页面（例如 /, /about, /contact 等）的 SEO，那么你可能需要预渲染。
```
prerender-spa-plugin 插件可以帮到你
```
- vue ssr 和 nuxt.js选谁
```
// 更详细的vue ssr记录可以看下面的注意事项
如果你倾向于使用提供了平滑开箱即用体验的更高层次解决方案，你应该去尝试使用 Nuxt.js。
如果你需要更直接地控制应用程序的结构，Nuxt.js 并不适合这种使用场景，你应该直接用vue ssr。
```
- 如何保持客户端和服务端共用同一份vue代码
```
1. 由于没有动态更新，所有的生命周期钩子函数中，只有 beforeCreate 和 created 会在服务器端渲染(SSR)过程中被调用。
2.1. 不要在beforeCreate 和 created两个生命周期函数里产生会对全局引起副作用的代码，例如：设置定时器setInterval。
2.2. 在纯客户端(client-side only)的代码中，我们可以设置一个 timer，然后在 beforeDestroy 或 destroyed 生命周期时将其销毁。但是，由于在 SSR 期间并不会调用销毁钩子函数，所以 timer 将永远保留下来。为了避免这种情况，请将副作用代码移动到 beforeMount 或 mounted 或其他生命周期中。
3. 通用代码不可接受特定平台的 API，因此如果你的代码中，直接使用了像 window 或 document，这种仅浏览器可用的全局变量，则会在 Node.js 中执行时抛出错误，反之也是如此。
4. api请求统一用axios来处理。
5.1. 编写客户端代码时，我们只会考虑当前请求所创建的Vue实例代码；但是编写服务端代码时，我们要知道NodeJS服务启动后，在不处理的情况下所创建的Vue实例将【只进行一次取值并留存在内存中】，这意味着它将在每个传入的请求之间共享，很容易导致交叉请求状态污染(cross-request state pollution)。
5.2. 因此，我们不应该直接在服务端创建一个应用程序实例，而是应该暴露一个可以重复执行的工厂函数，为每个请求创建新的应用程序实例：
// createAppFactory.js
// 同样的规则也适用于 router、store 和 event bus 实例。你不应该直接从模块导出并将其导入到应用程序中，而是需要在 createAppFactory 中创建一个新的实例，并从根 Vue 实例注入。
const Vue = require('vue')
module.exports = function createAppFactory (context) {
  return new Vue({
    data: {
      url: context.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })
}

```
6. pwa
7. 单元测试(x factor)
8. angular基本配置(x factor)
9. 增加pc页基本配置(header, content, footer三个基本块)
10. 开发自己的组件(侧方面push自己去看第三方样式库代码，加强css。 x factor)
### vue ssr的注意事项
> vue-server-renderer 和 vue 必须匹配版本。

## 后端待办
1. 增加一条路由：展示页-用于让用户访问不同入口打包生成的静态资源
2. 引入登录/注册功能(单点登录)
3. 引入数据库(mongoDB)
4. nodejs转发服务
5. 将个人系统作为一个官方模板整合进来(x factor)
## 本地调试
1. 进入src/pkg
2. node mkdir.js -p // 创建webpack.base.config.js文件到project/build/目录下，并copy一份到build目录下
3. npm run webpack:dev // 构建webpack，打包静态资源到dist/目录下
4. 进入src/
5. nodemon app.js --webpack:dev // 启动类似webpack-dev-server功能的服务，访问localhost:8080，即可把dist/目录下的静态资源全部加载，除html文件，其余资源热更新