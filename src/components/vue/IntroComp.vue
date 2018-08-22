<template>
    <div>
        <p>written by {{ name }}.</p>
        <p>his {{ age }} years old till totay.</p>
        <p>he got his first job in {{ getJobTime }}.</p>
        <p>his first language is {{ getLanguage }}.</p>
        <button @click="full">看看作者全名</button>
        <button @click="short">看看作者笔名</button>
        <button @click="short">看看作者笔名</button>
    </div>
</template>

<style scoped>
    
</style>

<script>
    import { mapState, mapGetters } from 'vuex'
    
    export default {
        data () {
            return {}
        },
        computed: mapState({
            name: 'name',
            age: state => state.age,
            // getJobTime () {
            //     return this.$store.getters.get1stJob
            // },
            // getLanguage () {
            //     return this.$store.getters.getLanguage('javascript')
            // }
            mapGetters([
                'getJobTime',
                'getLanguage'
            ])
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