<template>
    <div>
        <p @click="checkRoute">I am using {{ code }}.</p>
    </div>
</template>

<style scoped>
    
</style>

<script>
    import { mapState, mapMutations } from 'vuex'

    export default {
        props: ['id'],
        data () {
            return {
              code: 'Vue'
            }
        },
        created () {
        },
        methods: {
            checkRoute () {
                console.log(this.id, '路由组件传参: 将路由的param参数全部传入来')
            }
        }
    }
</script>