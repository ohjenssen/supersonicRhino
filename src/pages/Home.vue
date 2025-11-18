<script setup lang="ts">
import Exercise from '@/components/Exercise.vue';
import Squat from '@/components/Squat.vue';


</script>

<template>
    <section>
        <h1>Home</h1>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <Exercise />
        <!-- <Squat /> -->
    </section>
</template>

<style scoped>

</style>