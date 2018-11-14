<template>
    <div>
        <p>I am view.</p>
        <div>
            <router-link to="/view/tips">Go to /view/tips</router-link>
            <router-link to="/view/log">Go to /view/log</router-link>
        </div>
        <router-view></router-view>
        <router-view name="sidebar"></router-view>
        <router-view name="content"></router-view>
    </div>
</template>

<style scoped>
    
</style>

<script>
    import { mapState, mapMutations } from 'vuex'
    
    export default {
        data () {
            return {
            }
        },
        created () {
        },
        methods: {
        }
    }
</script>