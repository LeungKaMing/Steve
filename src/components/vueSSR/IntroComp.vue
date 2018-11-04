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
  }
}
</script>
