<script setup lang="ts">
    import Trash from '../icons/Trash.vue'
    
    const emit = defineEmits<{
        triggerModal: []
    }>();

    const handleClick = () => {
        emit('triggerModal')
    };
</script>

<template>
    <button @click="handleClick" class="delete-btn"><Trash /></button>
</template>

<style scoped>

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