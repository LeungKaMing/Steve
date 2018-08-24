<template>
    <div>
        <p>written by {{ name }}.</p>
        <p>his {{ age }} years old till totay.</p>
        <p>he got his first job in {{ get1stJob }}.</p>
        <p>his first language is {{ getLanguage }}.</p>
        <p>this text will show after 1s {{ delayText }}.</p>
        <p>did promise work out? {{ promiseText }}.</p>
        <button @click="full">看看作者全名</button>
        <button @click="short">看看作者笔名</button>
        <button @click="ajax('hi')">发起异步请求</button>
        <button @click="text('hi')">发起异步显示文案</button>
        <button @click="combinePromise('hi')">发起异步promise</button>
    </div>
</template>

<style scoped>
    
</style>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    
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
            ]),
            delayText: 'delayText',
            promiseText: 'promiseText'
        }),
        methods: {
            // mutation 都是同步事务
            full () {
                this.$store.commit('fullName')
            },
            // 等同于将方法this.short()指向this.$store.commit('shortName'), 只有重新映射参数才为对象；其他情况不映射的话这样写：...mapMutations(['shortName'])
            ...mapMutations({
                short: 'shortName'
            }),
            ajax (msg) {
                this.$store.dispatch('fakeAjax', {
                    msg
                })
            },
            /**
             * Action 提交的是 mutation，而不是直接变更状态。
             * Action 可以包含任意异步操作。
             */
            ...mapActions({
                text: 'delayText'
            }),
            ...mapActions(['combinePromise'])
        }
    }
</script>