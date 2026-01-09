<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  exercises: Array<{
    exerciseID: number
    exerciseName: string
  }>
  modelValue: number // The selected exerciseID
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [exerciseID: number]
}>()

const isOpen = ref(false)
const isDesktop = ref(window.innerWidth > 768)

const open = () => {
    isOpen.value = true
}

const close = () => {
    isOpen.value = false
}

const toggle = () => {
    isOpen.value = !isOpen.value
}

const handleSelect = (exerciseID: number) => {
    emit('update:modelValue', exerciseID)
    close()
}

const selectedExercise = computed(() => {
    return props.exercises.find(ex => ex.exerciseID === props.modelValue)
})

const handleClickOutside = (event: MouseEvent) => {
    const dropdown = document.querySelector('.dropdown-wrapper')
    if (dropdown && !dropdown.contains(event.target as Node)) {
        close()
    }
}

const handleResize = () => {
    isDesktop.value = window.innerWidth > 768
}

onMounted(async () => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
    console.log(props.exercises);
})

onUnmounted(async () => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', handleResize)
})
</script>

<template>
    <div class="container">
        <div class="dropdown-wrapper" :class="{ active: isOpen }" @mouseenter="isDesktop && open()" @mouseleave="isDesktop && close()" >
            <button class="dropdown-trigger" @click.prevent="toggle">
                <span>{{ selectedExercise?.exerciseName || 'Select Exercise' }}</span>
                <svg class="chevron-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M7 10l5 5 5-5z" fill="currentColor"></path>
                </svg>
            </button>
            
            <div class="dropdown-menu" :aria-expanded="isOpen">
                <div 
                    v-for="exercise in exercises" 
                    :key="exercise.exerciseID"
                    class="dropdown-item"
                    :class="{ selected: exercise.exerciseID === modelValue }"
                    @click="handleSelect(exercise.exerciseID)"
                >
                    {{ exercise.exerciseName }}
                </div>
                <!-- 
                <div class="dropdown-item" @click="close">
                    <svg class="item-icon" viewBox="0 0 24 24" width="18" height="18">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
                    </svg>
                    <span>Home</span>
                </div>
                
                <div class="dropdown-item has-submenu">
                    <svg class="item-icon" viewBox="0 0 24 24" width="18" height="18">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor"/>
                    </svg>
                    <span>Products</span>
                    <svg class="submenu-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M10 17l5-5-5-5v10z" fill="currentColor"/>
                    </svg>
                    
                    <div class="submenu">
                        <div class="dropdown-item" @click="close">New Arrivals</div>
                        <div class="dropdown-item" @click="close">Featured</div>
                        <div class="dropdown-item" @click="close">Categories</div>
                    </div>
                </div>
                
                <div class="dropdown-divider"></div>
                
                <div class="dropdown-item" @click="close">
                    <svg class="item-icon" viewBox="0 0 24 24" width="18" height="18">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="currentColor"/>
                    </svg>
                    <span>Notifications</span>
                    <span class="badge">3</span>
                </div>
                
                <div class="dropdown-item" @click="close">
                    <svg class="item-icon" viewBox="0 0 24 24" width="18" height="18">
                        <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="currentColor"/>
                    </svg>
                    <span>Settings</span>
                </div>
                 -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    /* Colors */
    --primary: #2196f3;
    --primary-glow: rgba(33, 150, 243, 0.4);
    --background: #0a0a12;
    --surface: rgba(30, 30, 45, 0.95);
    --surface-hover: rgba(40, 40, 60, 0.95);
    --text-secondary: rgba(255, 255, 255, 0.7);
    --border: rgba(255, 255, 255, 0.1);
    --shadow: rgba(0, 0, 0, 0.3);
    
    /* Effects */
    --glow: 0 0 10px var(--primary-glow);
    --glass: saturate(180%) blur(10px);
    --gradient: linear-gradient(135deg, var(--surface), rgba(40, 40, 60, 0.95));
    
    /* Timing */
    --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-medium: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Dimensions */
    --border-radius: 8px;
    --menu-min-width: 220px;

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    gap: 2rem;
}

/* Dropdown Styles */
.dropdown-wrapper {
    position: relative;
    z-index: 3;
}

.dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--primaryColor);
    border: 1px solid var(--primaryColor);
    border-radius: var(--border-radius);
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: all var(--transition-medium);
    backdrop-filter: var(--glass);
    -webkit-backdrop-filter: var(--glass);
}

.dropdown-menu {
    position: absolute;
    z-index: 3;
    top: calc(100% + 8px);
    left: -43px;
    min-width: var(--menu-min-width);
    background: var(--primaryColor);
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
    padding: 8px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all var(--transition-medium);
    backdrop-filter: var(--glass);
    -webkit-backdrop-filter: var(--glass);
    box-shadow: 0 4px 20px var(--shadow);
}

.dropdown-wrapper.active .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    color: var(--text);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
}

.dropdown-item:hover {
    background: var(--surface-hover);
    color: var(--primary);
}

.dropdown-item.selected {
    background: var(--surface-hover);
    font-weight: 600;
}

.dropdown-divider {
    height: 1px;
    background: var(--border);
    margin: 8px 0;
}

/* Submenu - For exercise categories? */
.has-submenu {
    padding-right: 36px;
}

.submenu-icon {
    position: absolute;
    right: 12px;
    transition: transform var(--transition-medium);
}

.has-submenu:hover .submenu-icon {
    transform: rotate(90deg);
}

.submenu { 
    position: absolute;
    z-index: 3;
    left: 100%;
    top: -8px;
    min-width: var(--menu-min-width);
    background: var(--gradient);
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
    padding: 8px;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-10px);
    transition: all var(--transition-medium);
    backdrop-filter: var(--glass);
    -webkit-backdrop-filter: var(--glass);
    box-shadow: 0 4px 20px var(--shadow);
}

.has-submenu:hover .submenu {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
}

/* Responsive */
@media (max-width: 768px) {
    .submenu {
        left: 0;
        top: 100%;
    }
}
</style>