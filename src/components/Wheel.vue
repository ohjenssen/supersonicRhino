<script setup lang="ts">

</script>

<template>
    <div class="wheel-1">
        <div class="wheel-2"></div>
    </div>
</template>

<style scoped>
    .wheel-1 {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: red;
        position: relative;
    }

    .wheel-2 {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: blue;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>