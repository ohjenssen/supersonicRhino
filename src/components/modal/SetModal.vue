<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { updateSet } from '@/utils/CRUD/updateSet';
    import { Set } from '@/types';

    const props = defineProps<{
        showUpdateModal: boolean
        set: {
            userID: number,
            repetitions: number,
            weight: number,
            exerciseID: number,
            setID: number
        }
    }>();

    const setToUpdate = ref({
        userID: props.set.userID,
        repetitions: props.set.repetitions,
        weight: props.set.weight,
        exerciseID: props.set.exerciseID,
        setID: props.set.setID
    });

    watch(() => props.set, (newSet) => {
        setToUpdate.value = {
            userID: newSet.userID,
            repetitions: newSet.repetitions,
            weight: newSet.weight,
            exerciseID: newSet.exerciseID,
            setID: newSet.setID

        };
    }, { deep: true });
    
    const emit = defineEmits<{
        confirmUpdate: [set: {setID: number, exerciseID: number, userID: number, repetitions: number, weight: number }],
        cancelUpdate: [],
    }>();
    
    const confirmUpdate = async () => {
        await updateSet(setToUpdate.value);
        emit('confirmUpdate', setToUpdate.value); // Pass the updated values
    }

    const cancelUpdate = () => {
        // Reset to original values on cancel
        setToUpdate.value = {
            userID: props.set.userID,
            repetitions: props.set.repetitions,
            weight: props.set.weight,
            exerciseID: props.set.exerciseID,
            setID: props.set.setID
        };
        emit('cancelUpdate');
    }
</script>

<template>
    <div class="backdrop" :class="{ show: props.showUpdateModal }">
        <div class="delete-container">
            <h2>Update?</h2>
            <form>
                <div class="input">
                    <label for="repetitions">Repetitions</label>
                    <input type="number" name="repetitions" id="repetitions" v-model="setToUpdate.repetitions">
                </div>
                <div class="input">
                    <label for="repetitions">Weight</label>
                    <input type="number" name="weight" id="weight" v-model="setToUpdate.weight">
                </div>
            </form>
            <div class="buttons-container">
                <button @click="confirmUpdate" class="update-btn">Confirm</button>
                <button @click="cancelUpdate" class="cancel-btn">Cancel</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .backdrop {
        display: flex;
        opacity: 0;
        pointer-events: none;
        position: fixed;
        z-index: 4;
        left: 0;
        right: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0,0.4);
        justify-content: center;
        align-items: center;
        transition: opacity 0.3s ease-in;
    }

    .delete-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 250px;
        background-color: rgba(2, 135, 22, 0.5);
        backdrop-filter: blur(10px);
        padding: 16px;
        border-radius: 15px;
        transform: scale(0.7);
        transition: transform 0.3s ease-in;
    }

    h2 {
        margin-top: 0px;
    }

    .buttons-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 75%;
        gap: 12px;
    }

    .show {
        opacity: 1;
        pointer-events: auto;
    }

    .show .delete-container {
        transform: scale(1);
    }

    .update-btn {
        padding: 8px 16px;
        border: 1px solid red;
        background-color: red;
        cursor: pointer;
        color: white;
        font-size: 14px;
        font-weight: 500;
        border-radius: 5px;
        transition: all 0.3s;
    }

    .update-btn:hover {
        background-color: rgb(144, 0, 0);
        border: 1px solid rgb(144, 0, 0);
    }

    .cancel-btn {
        padding: 8px 16px;
        cursor: pointer;
        border: 1px solid var(--primaryColor);
        background-color: var(--primaryColor);
        color: white;
        font-size: 14px;
        font-weight: 500;
        border-radius: 5px;
        transition: all 0.3s;
    }

    .cancel-btn:hover {
        background-color: rgb(72, 209, 9);
        border: 1px solid rgb(72, 209, 9);
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .input {
        margin: 8px 0px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
    }
</style>