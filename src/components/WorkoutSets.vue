<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { readExercises } from '@/utils/CRUD/readExercises';
import { readSetsByExercise } from '@/utils/CRUD/readSetsByExercise';
import { deleteSet } from '@/utils/CRUD/deleteSet';
import Trash from './icons/Trash.vue';
import WorkoutSetsForm from './WorkoutSetsForm.vue';
import type { Set, Exercise } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { isToday } from '@/utils/isToday';

// https://www.freecodecamp.org/news/how-event-handling-works-in-vue-3-guide-for-devs/
// https://medium.com/@weberzt/how-to-create-a-random-id-in-javascript-e92b39fedaef

let allSets = ref<Set[]>([]);

let exercises = ref<Exercise[]>([]);

let newSet = ref({
    weight: 0,
    repetitions: 0,
    exerciseID: 1,
    userID: 1,
})

// In the two functions below, its basically !isToday vs isToday based on allSets.value
// I put todaysSets and lasWorkoutSets in a computed property because... 
// ...if they should change for any reason we dont have to do a manual recalculation(for example reloading the page)

// Computed properties automatically update when data changes
const todaysSets = computed(() => {
    return allSets.value
        .filter(set => isToday(set.time))
        .reverse();
});

const lastWorkoutSets = computed(() => {
    // Get sets that are NOT today
    const previousSets = allSets.value.filter(set => !isToday(set.time));
    
    // If there are no previous sets then just give us an empty array.
    if (previousSets.length === 0) return [];
    
    // Find the most recent workout date
    const dates = previousSets.map(set => formatDate(set.time));
    const mostRecentDate = dates.sort().reverse()[0];
    
    // // Return only sets from that most recent date
    return previousSets
        .filter(set => formatDate(set.time) === mostRecentDate)
        .reverse(); // reverese so sets come in correct order
});

const handleExerciseChange = async (exerciseID: number) => {
    allSets.value = await readSetsByExercise(exerciseID);
}

const handleCreatedSet = async (set: Set) => {
    allSets.value.unshift(set); // Unshift isntead of push because shift adds it to end of the array
}

const handleDeleteSet = async (setID: number) => {
    await deleteSet(setID);
    allSets.value = await readSetsByExercise(newSet.value.exerciseID);
}


onMounted(async () => {
    exercises.value = await readExercises();
    allSets.value = await readSetsByExercise(newSet.value.exerciseID);
})
</script>

<template>
    <section>    
        <div class="sets-overview">

            <div class="sets-container">
                <h2>Last time:</h2>
                <p v-if="lastWorkoutSets.length === 0">No previous workout</p>
                <p v-for="set, index in lastWorkoutSets" :key="set.setID">Set {{ index + 1 }} -   {{ set.repetitions }} reps - {{ set.weight }}kg</p>
            </div>

            <div class="sets-container">
                <h2>Today</h2>
                <div class="single-set-container" v-for="set, index in todaysSets" :key="set.setID">
                    <p>Set {{ index + 1 }} -   {{ set.repetitions }} reps - {{ set.weight }}kg</p>
                    <button class="delete-btn" @click="handleDeleteSet(set.setID)"><Trash /></button>
                </div>
            </div>

        </div>
        <WorkoutSetsForm :exercises="exercises" @exerciseChanged="handleExerciseChange" @createdSet="handleCreatedSet"/>
    </section>
</template>

<style scoped>

    h2 {
        margin: 0px;
    }

    .sets-overview {
        display: flex;
        justify-content: space-between;
        width: 100%;
        max-width: 350px;
        min-height: 200px;
    }

    .single-set-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 160px;
    }

    .delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        width: 18px;
    }

    .delete-btn svg {
        width: 100%;
        height: 100%;
        fill: white;
    }
</style>