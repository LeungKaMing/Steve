<!-- Item.vue -->
<template>
  <div>{{ msg }}</div>
</template>

<script>
import * as ut from './assets/scripts/utils'

export default {
  asyncData ({store, route}) {
    console.log(store, route, '3<<<<<<<asyncData')
    return store.dispatch('fetchItem', 1)
  },
  title: 'I am introMe', // 插件混合自定义属性来玩
  mixins: [ut.default], // 插件混合自定义属性来玩
  data () {
    return {
      msg: 'hi, I am ssr intro me.'
    }
  }
}
</script>
