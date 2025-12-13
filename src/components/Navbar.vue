<script setup lang="ts">
import { onMounted, ref} from 'vue';

onMounted(() => {
})
</script>

<template>
    <nav>
        <div class="links-container">
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
        </div>
    </nav>
</template>

<style scoped>
    nav {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: green;
        width: 100%;
        height: 75px;
        position: absolute;
        left: 0px;
        bottom: 0;
    }

    .links-container {
        display: flex;
        justify-content: space-between;
        width: 300px;
    }
</style>