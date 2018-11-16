<template>
    <div>
        <p>his first language is {{ getLanguage }}.</p>
        <p>this text will show after 1s {{ delayText }}.</p>
        <p>did promise work out? {{ promiseText }}.</p>
        <button @click="ajax('hi')">发起异步请求</button>
        <button @click="text('hi')">发起异步显示文案</button>
        <button @click="combinePromise('hi')">发起异步promise</button>
    </div>
</template>

<style scoped>
    
</style>

<script>
    import { mapState, mapActions } from 'vuex'
    
    export default {
        data () {
            return {}
        },
        created () {
        },
        // 辅助函数mapState和mapGetters都会返回一个对象
        computed: mapState('intro',{
            getLanguage () {
                return this.$store.getters['intro/getLanguage']('javascript')
            },
            delayText: 'delayText',
            promiseText: 'promiseText'
        }),
        methods: {
            ajax (msg) {
                this.$store.dispatch('intro/fakeAjax', {
                    msg
                })
            },
            /**
             * Action 提交的是 mutation，而不是直接变更状态。
             * Action 可以包含任意异步操作。
             */
            ...mapActions({
                text: 'intro/delayText'
            }),
            ...mapActions('intro', ['combinePromise'])
        }
    }
</script>