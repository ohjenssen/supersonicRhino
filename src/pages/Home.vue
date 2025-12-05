<script setup lang="ts">
import { onMounted, ref } from 'vue';

let exercises = ref([]);

const fetchData = async () => {
        // const response = await fetch('https://supersonicrhinoapi.onrender.com/api/exercises');
        const response = await fetch('http://localhost:8080/api/exercises');
        const data = await response.json();
        exercises.value = data;
}

onMounted(() => {

    fetchData();
})

</script>

<template>
    <section>
        <h1>Home</h1>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        
        
        <div v-for="exercise in exercises">
            {{ exercise.exerciseName }}
        </div>
    </section>
</template>

<style scoped>

</style>