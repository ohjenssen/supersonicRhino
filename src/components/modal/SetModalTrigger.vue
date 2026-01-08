<script setup lang="ts">
    const props = defineProps<{
        set: {
            repetitions: number
            weight: number
        }
        setNumber: number
    }>();

    const emit = defineEmits<{
        triggerUpdateModal: []
    }>();

    const handleClick = () => {
        emit('triggerUpdateModal');
    }
</script>

<template>
    <div class="set-display" role="button" @click="handleClick">
        <p class="set-count">Set {{ setNumber + 1 }}</p>
        <p class="set">{{ props.set.repetitions }} reps - {{ props.set.weight }}kg</p>
    </div>
</template>

<style scoped>
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