<script setup lang="ts">
    const props = defineProps<{
        showDeleteModal: boolean
    }>();

    const emit = defineEmits<{
        confirmDelete: []
        cancel: []
    }>();

    const confirmDelete = () => {
        emit('confirmDelete');
    }

    const cancelDelete = () => {
        emit('cancelDelete');
    }
</script>

<template>
    <div class="backdrop" :class="{ show: props.showDeleteModal }">
        <div class="delete-container">
            <h2>Delete?</h2>
            <div class="buttons-container">
                <button @click="confirmDelete" class="delete-btn">Confirm</button>
                <button @click="cancelDelete" class="cancel-btn">Cancel</button>
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
        z-index: 1;
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

    .delete-btn {
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

    .delete-btn:hover {
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
</style>