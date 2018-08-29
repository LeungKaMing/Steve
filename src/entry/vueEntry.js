import "babel-polyfill";
import Vue from "vue";
import VueRouter from 'vue-router'
import { mapState } from 'vuex'
import store from '../store/vuexStore'
import IntroComp from '../components/vue/IntroComp.vue'
import AgeComp from '../components/vue/AgeComp.vue'
import AsyncComp from '../components/vue/AsyncComp.vue'
import CodeComp from '../components/vue/CodeComp.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/'
  },
  {
    path: '/intro',
    component: IntroComp,
    children: [
      {
        path: 'age',
        component: AgeComp
      },
      {
        path: 'async',
        component: AsyncComp
      },
      {
        path: 'code',
        component: CodeComp
      }
    ]
  }
]
const router = new VueRouter({
  routes
})

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
      console.log(to, from)
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