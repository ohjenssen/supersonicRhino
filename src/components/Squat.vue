<script setup lang="ts">
import { onMounted, ref } from 'vue';
    let weight = '';
    let repetitions = '';
    const sets = JSON.parse(localStorage.getItem("squat") ?? "");

    function handleSubmit(event: Event) {
        const form = event.target as HTMLFormElement;
        const formdata = new FormData(form);
        const info = Object.fromEntries(formdata.entries());

        // Add current date in yyyy/mm/dd format
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        info.date = `${yyyy}/${mm}/${dd}`;

        const key = form.getAttribute("name") ?? "";
        const exerciseString = localStorage.getItem(key);

        let exerciseData: any[] = [];

        if (exerciseString) {
            exerciseData = JSON.parse(exerciseString);
        }

        exerciseData.push(info); // add new submission

        localStorage.setItem(key, JSON.stringify(exerciseData));
    }

    function parseDate(dateStr: string): Date {
        const [yyyy, mm, dd] = dateStr.split('/');
        return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    }

    function getMostRecentDate(sets: any[]): string {
        if (!sets.length) return '';
        const dates = sets.map(set => set.date);
        const mostRecent = dates.reduce((latest, date) => {
            return parseDate(date) > parseDate(latest) ? date : latest;
        }, dates[0]);
        return mostRecent;
    }

    function getLastWorkout(sets: any[], lastDate: string) {
        return sets.filter(set => set.date === lastDate);
    }

    const lastWorkoutSets = ref<any[]>([]);

    onMounted(() => {
        const lastDate = getMostRecentDate(sets);
        lastWorkoutSets.value = getLastWorkout(sets, lastDate);
    })
</script>

<template>
    <div>
        <h2>Squat</h2>

        <div class="table">
            <div class="table-row">
                <h2>Last workout</h2>

                <div class="table-data" v-for="set in lastWorkoutSets">
                    <p>{{ set.weight }} kg</p>
                    <p>{{ set.repetitions }} reps</p>
                </div>
            </div>
            <div class="table-row">
                <h2>Today</h2>
            </div>
        </div>

        <form id="registration" name="squat" @submit.prevent="handleSubmit">
            <div class="input-container">
                <div class="single-input-container">
                    <label for="weight">Weight</label>
                    <input class="exercise-input" id="weight" name="weight" type="number" v-model="weight"></input>
                </div>
                
                <div class="single-input-container">
                    <label for="repetitions" >Repetitions</label>
                    <input class="exercise-input" id="repetitions" name="repetitions" type="number" v-model="repetitions"></input>
                </div>
            </div>

            <button class="submit-btn" type="submit">Add</button>
        </form>
    </div>
</template>

<style scoped>

    .table {
        display: flex;
        justify-content: space-between;
    }

    .table-data {
        display: flex;
        justify-content: space-between;
    }

    h2 {
        font-size: 12px;
    }

    #registration {
        margin: var(--marginElementsSmall);
    }

    .input-container {
        margin: var(--marginElementsSmall);
        display: flex;
    }

    .single-input-container {
        display: flex;
        flex-direction: column;
    }

    .exercise-input {
        width: 100px;
    }

    .submit-btn {
        width: 100%;
        background-color: var(--primaryColor);
        border: 1px solid var(--primaryColor);
        margin: var(--marginElementsSmall);
    }
</style>