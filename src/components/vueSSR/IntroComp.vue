<!-- Item.vue -->
<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  asyncData ({store, route}) {
    console.log(store, route, '2<<<<<<<asyncData')
    return store.dispatch('fetchItem', 1)
  },
  data () {
    return {
      msg: 'hi, I am ssr comp.'
    }
  },
  created () {
    // 这里的window.__INITIAL_STATE__只是上一次匹配路由的相关消息；当前匹配路由的相关消息是在asyncData的state里！
    console.log('global state: ', window.__INITIAL_STATE__)
  }
}
</script>
