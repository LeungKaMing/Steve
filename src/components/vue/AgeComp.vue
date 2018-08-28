<template>
    <div>
        <p>his {{ age }} years old till totay.</p>
        <button @click="addAge">+ age</button>
        <button @click="minAge">- age</button>
    </div>
</template>

<style scoped>
    
</style>

<script>
    import { mapState } from 'vuex'
    
    export default {
        data () {
            return {}
        },
        created () {
        },
        // 辅助函数mapState和mapGetters都会返回一个对象
        computed: mapState('intro',{
            age: state => state.age
        }),
        methods: {
            addAge () {
                this.$store.commit('intro/increment', {type: 'increment', num: 1})
            },
            minAge () {
                this.$store.commit('intro/decrement', {type: 'decrement', num: 1})
            }
        }
    }
</script>