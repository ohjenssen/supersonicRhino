<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const scrollContainer = ref<HTMLDivElement | null>(null)
const containerHeight = 200 // Total height of the picker container
const visibleItems = 5 // How many items you want visible (must be odd for centered selection)
const itemHeight = containerHeight / visibleItems // Calculate item height based on visible items
const isDragging = ref(false)
const startY = ref(0)
const startScrollTop = ref(0)
const lastY = ref(0)
const lastTime = ref(0)
const velocity = ref(0)
let momentumFrame: number | null = null

// Calculate padding to center the selected item
const centerPadding = computed(() => (containerHeight - itemHeight) / 2)

// Generate array of all possible values
const values = computed(() => {
  const result: number[] = []
  for (let i = props.min; i <= props.max; i += props.step) {
    result.push(i)
  }
  return result
})

// Current selected index
const selectedIndex = computed(() => {
  return values.value.findIndex(v => v === props.modelValue)
})

// Scroll to the selected value
const scrollToValue = (value: number, smooth = false) => {
  if (!scrollContainer.value) return
  
  const index = values.value.findIndex(v => v === value)
  if (index === -1) return
  
  const scrollTop = index * itemHeight
  
  if (smooth) {
    scrollContainer.value.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    })
  } else {
    scrollContainer.value.scrollTop = scrollTop
  }
}

// Handle scroll event to update selected value
const handleScroll = () => {
  if (!scrollContainer.value || isDragging.value) return
  
  const scrollTop = scrollContainer.value.scrollTop
  const index = Math.round(scrollTop / itemHeight)
  const clampedIndex = Math.max(0, Math.min(index, values.value.length - 1))
  
  if (values.value[clampedIndex] !== props.modelValue) {
    emit('update:modelValue', values.value[clampedIndex])
  }
}

// Snap to nearest value
const snapToNearest = () => {
  if (!scrollContainer.value) return
  
  const scrollTop = scrollContainer.value.scrollTop
  const index = Math.round(scrollTop / itemHeight)
  const clampedIndex = Math.max(0, Math.min(index, values.value.length - 1))
  
  scrollToValue(values.value[clampedIndex], true)
}

// Apply momentum scrolling
const applyMomentum = () => {
  if (!scrollContainer.value || Math.abs(velocity.value) < 0.1) {
    snapToNearest()
    return
  }
  
  velocity.value *= 0.95 // Deceleration factor
  scrollContainer.value.scrollTop += velocity.value
  
  // Update selected value during momentum
  const scrollTop = scrollContainer.value.scrollTop
  const index = Math.round(scrollTop / itemHeight)
  const clampedIndex = Math.max(0, Math.min(index, values.value.length - 1))
  
  if (values.value[clampedIndex] !== props.modelValue) {
    emit('update:modelValue', values.value[clampedIndex])
  }
  
  momentumFrame = requestAnimationFrame(applyMomentum)
}

// Mouse/touch event handlers
const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  startY.value = e.clientY
  lastY.value = e.clientY
  lastTime.value = Date.now()
  
  if (scrollContainer.value) {
    startScrollTop.value = scrollContainer.value.scrollTop
  }
  
  // Cancel any ongoing momentum
  if (momentumFrame) {
    cancelAnimationFrame(momentumFrame)
    momentumFrame = null
  }
  velocity.value = 0
  
  e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !scrollContainer.value) return
  
  const deltaY = startY.value - e.clientY
  scrollContainer.value.scrollTop = startScrollTop.value + deltaY
  
  // Calculate velocity for momentum
  const now = Date.now()
  const timeDelta = now - lastTime.value
  
  if (timeDelta > 0) {
    const moveDelta = lastY.value - e.clientY
    velocity.value = moveDelta / timeDelta * 16 // Normalize to ~60fps
  }
  
  lastY.value = e.clientY
  lastTime.value = now
  
  // Update selected value during drag
  const scrollTop = scrollContainer.value.scrollTop
  const index = Math.round(scrollTop / itemHeight)
  const clampedIndex = Math.max(0, Math.min(index, values.value.length - 1))
  
  if (values.value[clampedIndex] !== props.modelValue) {
    emit('update:modelValue', values.value[clampedIndex])
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  
  // Start momentum scrolling if velocity is significant
  if (Math.abs(velocity.value) > 0.5) {
    applyMomentum()
  } else {
    snapToNearest()
  }
}

// Calculate opacity based on distance from center
const getItemStyle = (index: number) => {
  const distance = Math.abs(index - selectedIndex.value)
  const opacity = Math.max(0.3, 1 - distance * 0.25)
  const scale = Math.max(0.7, 1 - distance * 0.1)
  
  return {
    opacity,
    transform: `scale(${scale})`
  }
}

// Initialize scroll position
onMounted(() => {
  scrollToValue(props.modelValue, false)
  
  // Add global event listeners
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  
  if (momentumFrame) {
    cancelAnimationFrame(momentumFrame)
  }
})

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (!isDragging.value) {
    scrollToValue(newValue, true)
  }
})
</script>

<template>
  <div class="number-picker">
    <div class="picker-container">
      <!-- Selection indicator overlay -->
      <div class="selection-indicator"></div>
      
      <!-- Scrollable number list -->
      <div 
        ref="scrollContainer"
        class="scroll-container"
        :class="{ dragging: isDragging }"
        @mousedown="handleMouseDown"
        @scroll="handleScroll"
      >
        <!-- Top padding -->
        <div :style="{ height: `${itemHeight * 2}px` }"></div>
        
        <!-- Number items -->
        <div
          v-for="(value, index) in values"
          :key="value"
          class="number-item"
          :class="{ selected: index === selectedIndex }"
          :style="{ 
            height: `${itemHeight}px`,
            ...getItemStyle(index)
          }"
          @click="scrollToValue(value, true)"
        >
          {{ value }}
        </div>
        
        <!-- Bottom padding -->
        <div :style="{ height: `${itemHeight * 2}px` }"></div>
      </div>
      
      <!-- Gradient overlays -->
      <div class="gradient-top"></div>
      <div class="gradient-bottom"></div>
    </div>
  </div>
</template>

<style scoped>
.number-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.picker-container {
  position: relative;
  width: 60px;
  height: 200px; /* Must match containerHeight in script */
  overflow: hidden;
  background: #f8f9fa;
  border-radius: 50px;
  /* box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.1); */
}

.scroll-container {
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  cursor: grab;
}

.scroll-container.dragging {
  cursor: grabbing;
  scroll-snap-type: none;
}

.scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.number-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  color: var(--primaryColor);
  scroll-snap-align: center;
  transition: opacity 0.2s, transform 0.2s;
  cursor: pointer;
}

.number-item.selected {
  font-weight: 700;
  color: var(--primaryColor);
}

.selection-indicator {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 40px; /* Must match itemHeight (150px / 5 items = 30px) */
  transform: translateY(-50%);
  background: var(--primaryColorTransparent);
  /* border-top: 1px solid var(--primaryColor);
  border-bottom: 1px solid var(--primaryColor); */
  pointer-events: none;
  z-index: 1;
}

.gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px; /* Adjust based on new container height */
  background: linear-gradient(to bottom, #f8f9fa 0%, transparent 100%);
  pointer-events: none;
  z-index: 2;
}

.gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px; /* Adjust based on new container height */
  background: linear-gradient(to top, #f8f9fa 0%, transparent 100%);
  pointer-events: none;
  z-index: 2;
}
</style>
