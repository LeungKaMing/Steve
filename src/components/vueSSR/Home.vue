<!-- Item.vue -->
<template>
  <div class="msg">{{ msg }} <p>from home.</p> </div>
</template>

<style scoped>
  .msg {
    color: aquamarine;
  }
</style>


<script>
export default {
  // ssr预渲染数据优先级会比created还要早，详情可看entry-server.js
  // [自定义静态函数-asyncData]：注意，由于此函数会在组件实例化之前调用，所以它无法访问 this。需要将 store 和路由信息作为参数传递进去
  asyncData ({store, route}) {
    return store.dispatch('fetchItem', 1)
  },
  data () {
    return {
      msg: 'hi, I am ssr home.'
    }
  },
  created () {
    console.log('context: ', this.$ssrContext)
  }
}
</script>
