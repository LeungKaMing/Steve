function getTitle (vm) {
  /**
   * 1. 组件可以提供一个 `title` 选项，此选项可以是一个字符串或函数
   * 2. 为什么公共方法getTitle以this.$options来拿呢？因为无论服务端还是客户端，这个属性都存在的 => 服务端要同步title给$ssrContext.title【就是app.js里面的templateContext.title】；客户端要同步给document.title
   * 3. 好处在于一个公共方法，两端通用
   */
  const { title } = vm.$options
  if (title) {
    return typeof title === 'function'
      ? title.call(vm)
      : title
  }
}

const serverTitleMixin = {
  // 留意生命周期有没混淆
  // 服务端只有beforeCreated 和 created生命周期
  created () {
    const title = getTitle(this)
    console.log('in ssr: ', title)
    if (title) {
      this.$ssrContext.title = title
    }
  }
}

const clientTitleMixin = {
  // 客户端没有生命周期限制
  beforeCreate () {
    const title = getTitle(this)
    console.log('in client: ', title)
    if (title) {
      document.title = title
    }
  }
}

// 可以通过 `webpack.DefinePlugin` 注入 `VUE_ENV`
export default process.env.VUE_ENV === 'server'
  ? serverTitleMixin
  : clientTitleMixin 