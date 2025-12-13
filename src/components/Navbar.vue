<script setup lang="ts">
import { useRoute } from 'vue-router';
import HomeIcon from './icons/HomeIcon.vue';
import HomeIconFill from './icons/HomeIconFill.vue';
import InfoIcon from './icons/InfoIcon.vue';
import InfoIconFill from './icons/InfoIconFill.vue';
const route = useRoute();
</script>

<template>
    <nav>
        <div class="links-container">
            <div class="link-container">
                <router-link to="/">
                    <HomeIconFill v-if="route.path === '/'"/>
                    <HomeIcon v-else/>
                </router-link>
            </div>
            <div class="link-container">
                <router-link to="/about">
                    <InfoIconFill v-if="route.path === '/about'" />
                    <InfoIcon v-else />
                </router-link>
            </div>
        </div>
    </nav>
</template>

<style scoped>
    nav {
        background-color: rgba(2, 135, 22, 0.5);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 75px;
        max-width: 350px;
        position: absolute;
        left: 50%;
        bottom: 5px;
        transform: translate(-50%, -50%);
        border-radius: 100px;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;
    }

    .links-container {
        display: flex;
        justify-content: space-between;
        width: 200px;
    }

    .link-container a {
        display: block;
        width: 50px;
        height: 50px;
        text-align: center;
    }

    .link-container svg {
        width: 20px;
        height: 100%;
        fill: white;
    }
</style>