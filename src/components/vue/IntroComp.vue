<template>
    <div>
        <p>written by {{ name }}.</p>
        <p>his {{ age }} years old till totay.</p>
        <p>he got his first job in {{ get1stJob }}.</p>
        <p>his first language is {{ getLanguage }}.</p>
        <button @click="full">看看作者全名</button>
        <button @click="short">看看作者笔名</button>
        <button @click="short">看看作者笔名</button>
    </div>
</template>

<style scoped>
    
</style>

<script>
    import { mapState, mapGetters, mapMutations } from 'vuex'
    
    export default {
        data () {
            return {}
        },
        // 辅助函数mapState和mapGetters都会返回一个对象
        computed: mapState({
            name: 'name',
            age: state => state.age,
            getLanguage () {
                return this.$store.getters.getLanguage('javascript')
            },
            ...mapGetters([
                'get1stJob'
            ])
        }),
        methods: {
            // mutation 都是同步事务
            full () {
                this.$store.commit('fullName')
            },
            ...mapMutations({
                short: 'shortName'
            })
        }
    }
</script>