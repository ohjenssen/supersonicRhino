<script setup lang="ts">
    import { ref } from 'vue';
    import { createSet } from '@/utils/CRUD/createSet';
    import type { Set } from '@/types';
    import NumberPicker from './NumberPicker.vue';

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

    const test = () => {
        // console.log(newSet.weight);
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
            <div class="numbered-input-container">
                <div class="number-input-container">
                    <label for="repetitions">Repetitions</label>
                    <NumberPicker v-model="newSet.repetitions" min:="0" :max="300"/>
                </div>
                <div class="number-input-container">
                    <label for="weight">Weight</label>
                    <NumberPicker v-model="newSet.weight" min:="0" :max="300"/>
                </div>
            </div>
        <button type="submit" class="add-exercise-btn">Submit</button>
    </form>
    <!-- <Wheel /> -->
</template>

<style >
    .add-exercise-btn {
        background-color: var(--primaryColor);
        border: 1px solid var(--primaryColor);
        border-radius: 16px;
        padding: 16px 8px;
    }

    .add-exercise-btn:hover {
        background-color: var(--primaryColorHover);
        border: 1px solid var(--primaryColorHover);
        transition: 0.3s;
    }
    .setForm {
        display: flex;
        flex-direction: column;
        height: 200px;
        justify-content: space-between;
        width: 100%;
        max-width: 350px;
        margin-top: 16px;
    }
    
    .input-container {
        display: flex;
        flex-direction: column;
    }

    .numbered-input-container {
        display: flex;
        justify-content: space-around;
        width: 100%;
        margin: 16px 0px;
    }

    .number-input-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>