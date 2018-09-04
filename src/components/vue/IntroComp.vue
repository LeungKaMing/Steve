<template>
    <div>
        <p>路由导航：{{ demo }}</p>
        <p>written by {{ name }} and role is {{ getQuery }}.</p>
        <button @click="full">看看作者全名</button>
        <button @click="short">看看作者笔名</button>
        <button @click="goTo">编程式导航/intro/code, id以query方式书写</button>
        <button @click="goTo('dir')">编程式导航/intro/code, id以目录方式书写</button>
        <div>
            <router-link to="/intro/age">声明式导航/intro/age</router-link>
            <router-link to="/intro/async">声明式导航/intro/async</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<style scoped>
    
</style>

<script>
    import { mapState, mapMutations } from 'vuex'
    
    export default {
        data () {
            return {
                demo: ''
            }
        },
        created () {
        },
        beforeRouteEnter (to, from, next) {
            console.log(to, from, next, '路由进入前')
            next()
        },
        beforeRouteUpdate (to, from, next) {
            console.log(to, from, next, '路由更新时')
            console.log(this)
            this.demo = to.params
            next()
        },
        // 好像无用?
        // beforeRouterLeave (to, from, next) {
        //     console.log(to, from, next, '路由跳出后')
        //     window.confirm('Do you really want to leave? you have unsaved changes!')
        //     next()
        // },
        // 辅助函数mapState和mapGetters都会返回一个对象
        computed: mapState('intro',{
            name: 'name',
            getQuery () {
                return this.$route.query.id
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
            }),
            goTo (dir) {
                // push会向 history 添加新记录
                /**
                 * 1. 如果跳转后返回不期望回到刚刚的页面，那么你可以选择用replace
                 * 2. 跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。
                 * 3. 如果你用了relace进行跳转，那么 history 记录中是找不到刚刚的页面记录，即无法使用router.go()
                 */
                if (dir === 'dir') {
                    // dir
                    this.$router.push({
                        name: 'codeName',
                        params: {
                            id: '123'
                        }   
                    })
                } else {
                    // query
                    this.$router.push({
                        name: 'codeName2',
                        query: {
                            id: '123'
                        }
                    }, () => {
                        console.log(arguments, '导航成功完成')
                    }, () => {
                        console.log(arguments, '导航到相同的路由')
                    })
                }
            }
        }
    }
</script>