<template>
    <div id="app">
        <p>
            <router-link to="/vuessr">Go to /vuessr</router-link>
            <router-link to="/me?1">Go to /me</router-link>
            <router-link to="/intro?2">Go to /intro</router-link>
        </p>
        <router-view></router-view>
    </div>
</template>

<style>

</style>

<script>
    export default {
    }
</script>