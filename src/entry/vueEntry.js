import "babel-polyfill";
import Vue from "vue";
import VueRouter from 'vue-router'
import { mapState } from 'vuex'
import store from '../store/vuexStore'
import IntroComp from '../components/vue/IntroComp.vue'
import AgeComp from '../components/vue/AgeComp.vue'
import AsyncComp from '../components/vue/AsyncComp.vue'
import CodeComp from '../components/vue/CodeComp.vue'
// 命名视图-多router-view玩法
import ViewComp from '../components/vue/view/ViewComp.vue'
import TipsComp from '../components/vue/view/TipsComp.vue'
import LogComp from '../components/vue/view/LogComp.vue'
import ContentComp from '../components/vue/view/ContentComp.vue'
import SibarComp from '../components/vue/view/SibarComp.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/'
  },
  {
    path: '/intro',
    component: IntroComp,
    beforeEnter: (to, from, next) => {
      // 相当于局部路由的beforeEach方法；同样也可以写在组件内部，用这个方法实现：beforeRouteEnter
      // console.log(to, from, next)
      next()
    },
    children: [
      {
        path: 'age',
        component: AgeComp
      },
      {
        path: 'async',
        component: AsyncComp
      },
      // 如果 props 被设置为 true，$route.params 将会被设置为组件属性。
      {
        name: 'codeName',
        path: 'code/:id',
        component: CodeComp,
        props: true
      },
      {
        name: 'codeName2',
        path: 'code',
        component: CodeComp,
        // 将$route的属性值自由组合，然后作为props赋值给组件
        props: (route) => route.query
      }
    ]
  },
  {
    path: '/view',
    component: ViewComp,
    children: [
      {
        path: 'tips',
        component: TipsComp
      },
      {
        path: 'log',
        components: {
          sidebar: SibarComp,
          content: ContentComp
        }
      }
    ]
  }
]
const router = new VueRouter({
  // nodejs对路由做了处理后，即可用这种模式，去除hash模式的#
  // mode: 'history',
  routes
})

// 全局守卫 -- 当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 等待中。
// 通常在【全局】做一些初始化操作行为时候用到
// router.beforeEach((to, from, next) => {
//   // console.log(to.params, 'to.params')
//   // console.log(from.params, 'from.params')
//   // 确保要调用 next 方法，否则钩子就不会被 resolved
//   next()
// })

new Vue({
  el: '#app',
  store,
  router,
  data () {
    return {
      msg: 'Hello, Vue!'
    }
  },
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
      // console.log(to, from, 'in watch')
    }
  },
  // components: {
  //   IntroComp
  // },
  /**
   * Vuex给我们提供了辅助函数mapState，该函数做了一些简便操作返回一个对象，可以令我们少打几个字更快书写计算属性。
   * 1. 一般情况下：
   * computed: {
   *  count () {
   *    return this.$store.state.count
   *  },
   *  name () {
   *    return this.$store.state.name
   *  }
   * },
   * 
   * 2. 当计算属性跟状态名相同时，还可以简写成：
   * computed: Vuex.mapState(['count', 'name', 'age']),
   * 
   * 3. 由于该辅助函数返回一个对象，还可以用到ES6对象展开符：
   * computed: {
   *   ...Vuex.mapState({
   *     count () {
   *       return this.$store.state.count
   *     },
   *     name: 'name',
   *     age: state => state.age
   *   })
   * },
   * 
   * 4. 下面用到的是普通高级写法：
   */
  computed: mapState('intro', [
    'count'
  ]),
  created () {
  },
  methods: {
    add () {
      store.commit('intro/increment')
    },
    min () {
      store.commit('intro/decrement')
    }
  }
})