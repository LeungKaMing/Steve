import "babel-polyfill";
import Vue from "vue";
import { mapState } from 'vuex'
import store from '../store/vuexStore'
import IntroComp from '../components/vue/IntroComp.vue'

new Vue({
  el: '#app',
  store,
  data () {
    return {
      msg: 'Hello, Vue!'
    }
  },
  components: {
    IntroComp
  },
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
  computed: mapState({
    count () {
      return this.$store.state.count
    }
  }),
  created () {
  },
  methods: {
    add () {
      store.commit('increment')
    },
    min () {
      store.commit('decrement')
    },
    addAge () {
      store.commit('increment', {type: 'increment', num: 1})
    },
    minAge () {
      store.commit('decrement', {type: 'decrement', num: 1})
    }
  }
})