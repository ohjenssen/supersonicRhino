<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { readExercises } from '@/utils/CRUD/readExercises';
import { readSetsByExercise } from '@/utils/CRUD/readSetsByExercise';
import { deleteSet } from '@/utils/CRUD/deleteSet';
import WorkoutSetsForm from './WorkoutSetsForm.vue';
import { formatDate } from '@/utils/formatDate';
import { isToday } from '@/utils/isToday';
import type { Set, Exercise } from '@/types';
import DeleteModalTrigger from './modal/DeleteModalTrigger.vue';
import DeleteModal from './modal/DeleteModal.vue';
import SetModalTrigger from './modal/SetModalTrigger.vue';
import SetModal from './modal/SetModal.vue';

// https://www.freecodecamp.org/news/how-event-handling-works-in-vue-3-guide-for-devs/
// https://medium.com/@weberzt/how-to-create-a-random-id-in-javascript-e92b39fedaef

let allSets = ref<Set[]>([]);

let exercises = ref<Exercise[]>([]);

let newSet = ref({
    weight: 0,
    repetitions: 0,
    exerciseID: 1,
    userID: 1
})


let showDeleteModal = ref(false);
let showUpdateModal = ref(false);

let setIdToDelete = ref(0);
let setToUpdate = ref({
    weight: 0,
    repetitions: 0,
    exerciseID: 1,
    userID: 1,
    setID: 0,
});

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

const handleDeleteSet = async () => {
    handleDeleteModal(setIdToDelete.value);
    await deleteSet(setIdToDelete.value);
    allSets.value = await readSetsByExercise(newSet.value.exerciseID);
}

const handleDeleteModal = async (setID: number) => {
    setIdToDelete.value = setID;
    showDeleteModal.value = !showDeleteModal.value;
}

const handleUpdateModal = async (set: Set) => {
    setToUpdate.value = set;
    showUpdateModal.value = !showUpdateModal.value;
}

const handleConfirmUpdate = async () => {
    showUpdateModal.value = false;
    allSets.value = await readSetsByExercise(setToUpdate.value.exerciseID);
}

const handleCancelUpdate = () => {
    showUpdateModal.value = false;
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
                <div class="single-set-container" v-for="set, index in lastWorkoutSets">
                    <div class="set-display">
                        <SetModalTrigger :set="set" :setNumber="index" />
                    </div>
                </div>
            </div>

            <div class="sets-container">
                <h2>Today</h2>
                <div class="single-set-container" v-for="set, index in todaysSets" :key="set.setID">
                    <div class="set-display">
                        <SetModalTrigger :set="set" :setNumber="index" @triggerUpdateModal="handleUpdateModal(set)"/>
                    </div>
                     <DeleteModalTrigger @triggerModal="handleDeleteModal(set.setID)"/>
                </div>
            </div>

        </div>
        <WorkoutSetsForm :exercises="exercises" @exerciseChanged="handleExerciseChange" @createdSet="handleCreatedSet"/>
    </section>
    <SetModal :showUpdateModal="showUpdateModal" :set="setToUpdate" @confirmUpdate="handleConfirmUpdate" @cancelUpdate="handleCancelUpdate"/>
    <DeleteModal :showDeleteModal="showDeleteModal" @confirmDelete="handleDeleteSet()" @cancelDelete="handleDeleteModal(0)"/>
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
        min-height: 250px;
        background-color: rgba(2, 135, 22, 0.5);
        backdrop-filter: blur(10px);
        box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;
        border-radius: 30px;
    }

    .sets-container {
        padding: 30px 15px 10px 15px;
    }

    .single-set-container {
        display: flex;
        align-items: end;
        justify-content: space-between;
        width: 120px;
    }

    .set-display {
        margin-top: 8px;
    }

    .set-count {
        padding: 0px;
        margin: 0px;
        font-size: 8px;
        color: rgba(255, 255, 255, 0.5);
    }

    .set {
        padding: 0px;
        margin: 0px;
    }
</style>