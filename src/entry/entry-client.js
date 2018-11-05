import { createApp } from './vueSSR'

// 客户端特定引导逻辑……

const { app, router, store } = createApp()

// 这里假定 App.vue 模板中根元素具有 `id="app"`
router.onReady(() => {
    // if (window.__INITIAL_STATE__) {
    //   // 客户端想跟服务端混合成功，意味着其store要以window.__INITIAL_STATE__为准
    //   store.replaceState(window.__INITIAL_STATE__)
    // }
    router.beforeResolve((to, from, next) => {
      const matched = router.getMatchedComponents(to)
      const prevMatched = router.getMatchedComponents(from)
      
      console.log('preMatch与match: ', prevMatched, matched)

      // 我们只关心非预渲染的组件
      // 所以我们对比它们
      let diffed = false
      const activated = matched.filter((c, i) => {
        // prevMatched[i] !== c 保证prevMatched的项 与 matched的项不相等，找出两个匹配列表的差异组件
        return diffed || (diffed = (prevMatched[i] !== c))
      })
  
      if (!activated.length) {
        return next()
      }
  
      // 对下一个匹配的路由组件(matched的部分)进行遍历，检测到有asyncData的就进行调用 => 目的：唯一使上一个匹配的路由组件(preMatched的部分)与下一个匹配的路由组件(matched的部分)造成差异的原因，就只有是否执行过数据预获取操作(asyncData)
      Promise.all(activated.map(c => {
        if (c.asyncData) {
          return c.asyncData({ store, route: to })
        }
      })).then(() => {
        next()
      }).catch(next)
    })
    app.$mount('#app', true)
})