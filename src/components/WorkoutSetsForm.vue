<script setup lang="ts">
    import { ref } from 'vue';
    import { createSet } from '@/utils/CRUD/createSet';
    import type { Set } from '@/types';

    // Define what props this component receives from parent
    interface Props {
        exercises: Array<{
            exerciseID: number;
            exerciseName: string;
        }>;
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        exerciseChanged: [exerciseID: number],  // Name of event + what data it sends
        createdSet: [set: Set]
    }>();

    let newSet = ref({
        weight: 0,
        repetitions: 0,
        exerciseID: 1,
        userID: 1,
    })

    const handleCreateSet = async () => {
        try {
            const newSetData = await createSet(newSet.value);
            emit('createdSet', newSetData)
        } catch (error) {
            console.log('error');
        }
    }

    const handleExerciseChange = () => {
        emit('exerciseChanged', newSet.value.exerciseID); // Send the exerciseID
    }
</script>

<template>
    <form @submit.prevent="handleCreateSet" class="setForm">
            <div class="input-container">
                <label for="exercises">Exercise</label>
                <select name="exercises" id="exercises" v-model="newSet.exerciseID" @change="handleExerciseChange">
                    <option v-for="exercise in exercises" :value="exercise.exerciseID">{{ exercise.exerciseName }}</option>
                </select>
            </div>
            <div class="input-container">
                <label for="repetitions">Repetitions</label>
                <input name="repetitions" type="number" v-model="newSet.repetitions" />
            </div>
            <div class="input-container">
                <label for="weight">weight</label>
                <input name="weight" type="number" v-model="newSet.weight" />
            </div>
        <button type="submit">Submit</button>
    </form>
</template>

<style scoped>
    .setForm {
        display: flex;
        flex-direction: column;
        height: 200px;
        justify-content: space-between;
        width: 100%;
        max-width: 350px;
    }
    
    .input-container {
        display: flex;
        flex-direction: column;
    }
</style>