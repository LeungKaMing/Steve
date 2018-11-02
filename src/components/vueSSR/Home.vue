<!-- Item.vue -->
<template>
  <div>{{ msg }} <p>fromStore: {{ fromStore }}</p> </div>
</template>

<script>
export default {
  asyncData ({store, route}) {
    return store.dispatch('fetchItem', 1)
  },
  data () {
    return {
      msg: 'hi, I am ssr home.'
    }
  },
  computed: {
    fromStore () {
      console.log(this.$store.state.items, '>>>>>>')
    }
  }
}
</script>
