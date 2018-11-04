<!-- Item.vue -->
<template>
  <div>{{ msg }} <p>from home.</p> </div>
</template>

<script>
export default {
  // ssr预渲染数据优先级会比created还要早，详情可看entry-server.js
  // 这里的逻辑是先有asyncData，computed方法里面的this.$store.state.items才会有输出 => 因为在vue store里面有Vue.set进行items的属性值更新
  asyncData ({store, route}) {
    return store.dispatch('fetchItem', 1)
  },
  data () {
    return {
      msg: 'hi, I am ssr home.'
    }
  },
  created () {
    console.log(`Let's see what happened in store: ${this.$store.state}`)
  }
}
</script>
