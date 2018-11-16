 <template>
   <div class="msg">{{ msg }} </div>
 </template>
 
 <style scoped>
   .msg {
     color: aquamarine;
   }
 </style>
 
 
 <script>
 import * as ut from './assets/scripts/utils'
 
 export default {
   // ssr预渲染数据优先级会比created还要早，详情可看entry-server.js
   // [自定义静态函数-asyncData]：注意，由于此函数会在组件实例化之前调用，所以它无法访问 this。需要将 store 和路由信息作为参数传递进去
   asyncData ({store, route}) {
    return store.dispatch('fetchItem', 1)
  },
  title: 'I am home', // 插件混合自定义属性来玩
  mixins: [ut.default], // 插件混合自定义属性来玩
  mixins: [ut.default], // 插件混合自定义属性来玩【同时兼容客户端和服务端两套代码】
  data () {
    return {
      msg: 'hi, I am Leung.'
    }
  },
  created () {
    // console.log('服务器端渲染上下文：', this.$ssrContext.title)
    console.log('客户端（可以理解成公共）: ', this.$options.data)
    console.log('客户端2（可以理解成公共）: ', this.$options.data())
    console.log('Vue会merge相同名字的钩子函数')
  }
}
</script>