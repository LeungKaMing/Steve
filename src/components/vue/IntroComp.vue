<template>
    <div>
        <p>written by {{ name }} and his {{ age }} years old till totay.</p>
        <button @click="full">看看作者全名</button>
        <button @click="short">看看作者笔名</button>
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
        computed: mapState({
            name: 'name',
            age: state => state.age
        }),
        methods: {
            full () {
                this.$store.commit('fullName')
            },
            short () {
                this.$store.commit('shortName')
            }
        }
    }
</script>