<script setup lang="ts">
    let weight = '';
    let repetitions = '';
    const exercises = JSON.parse(localStorage.getItem("exercises") ?? "");
    console.log(exercises);

    function handleSubmit(event: Event) {
        const form = event.target as HTMLFormElement;
        const formdata = new FormData(form);
        const info = Object.fromEntries(formdata.entries());

        // Add current date in dd/mm/yyyy format
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        info.date = `${dd}/${mm}/${yyyy}`;

        const key = form.getAttribute("name") ?? "";
        const exerciseString = localStorage.getItem(key);

        let exerciseData: any[] = [];

        if (exerciseString) {
            exerciseData = JSON.parse(exerciseString);
        }

        exerciseData.push(info); // add new submission

        localStorage.setItem(key, JSON.stringify(exerciseData));
    }
</script>

<template>
    <div>
        <h2>Squat</h2>
        <table>
            <tr>
                <th>Last workout</th>
                <th>Today</th>
            </tr>
            <tr>
                <td>10 reps - 100kg</td>
                <td>10 reps - 102.5kg</td>
            </tr>
            <tr>
                <td>8 reps - 102.5kg</td>
                <td>10 reps - 105kg</td>
            </tr>
            <tr>
                <td>4 reps - 102.5kg</td>
                <td>8 reps - 107.5kg</td>
            </tr>
        </table>

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
    table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
        margin: var(--marginElementsSmall);
    }

    td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
        font-size: 12px;
    }
    
    tr:nth-child(even) {
        background-color: #dddddd;
        color: black;
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