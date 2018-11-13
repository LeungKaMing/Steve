<!-- Item.vue -->
<template>
  <div>{{ msg }}</div>
</template>

<script>
import * as ut from './assets/scripts/utils'

export default {
  asyncData ({store, route}) {
    console.log(store, route, '2<<<<<<<asyncData')
    return store.dispatch('fetchItem', 1)
  },
  title: 'I am introComp', // 插件混合自定义属性来玩
  mixins: [ut.default], // 插件混合自定义属性来玩
  data () {
    return {
      msg: 'hi, I am ssr comp.'
    }
  },
  created () {
    // 这里的window.__INITIAL_STATE__只是上一次匹配路由的相关消息；当前匹配路由的相关消息是在asyncData的state里！
    console.log('global state: ', window.__INITIAL_STATE__)
    console.log('route: ', this.$route)
  }
}
</script>
