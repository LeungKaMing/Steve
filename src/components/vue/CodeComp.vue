<template>
    <div>
        <p>I am using {{ code }}.</p>
    </div>
</template>

<style scoped>
    
</style>

<script>
    import { mapState, mapMutations } from 'vuex'
    
    export default {
        data () {
            return {
              code: 'Vue'
            }
        },
        created () {
            console.log(this.$router, '$router')
            console.log(this.$route, '$route')
        },
        methods: {
        }
    }
</script>