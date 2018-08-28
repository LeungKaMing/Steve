<template>
    <div>
        <p>written by {{ name }} and role is {{ getQuery }}.</p>
        <button @click="full">看看作者全名</button>
        <button @click="short">看看作者笔名</button>
        <router-link to="/intro/age">Go to Age</router-link>
        <router-link to="/intro/async">Go to Async</router-link>
        <router-view></router-view>
    </div>
</template>

<style scoped>
    
</style>

<script>
    import { mapState, mapMutations } from 'vuex'
    
    export default {
        data () {
            return {}
        },
        created () {
            console.log(this.$router, '$router')
            console.log(this.$route, '$route')
        },
        // 辅助函数mapState和mapGetters都会返回一个对象
        computed: mapState('intro',{
            name: 'name',
            getQuery () {
                return this.$route.query.userRole
            }
        }),
        methods: {
            // mutation 都是同步事务
            full () {
                this.$store.commit('intro/fullName')
            },
            // 等同于将方法this.short()指向this.$store.commit('shortName'), 只有重新映射参数才为对象；其他情况不映射的话这样写：...mapMutations(['shortName'])
            ...mapMutations({
                short: 'intro/shortName'
            })
        }
    }
</script>