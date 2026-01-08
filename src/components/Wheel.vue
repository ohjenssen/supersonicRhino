<template>
  <div class="carousel-wrapper">
    <div class="carousel">
      <div 
        v-for="(item, index) in carouselItems" 
        :key="index"
        class="carousel-item"
        :style="getItemStyle(index)"
        @click="handleItemClick(index)"
      >
        <div class="carousel-box">
          <div class="num">{{ item.num }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'

const carouselItems = Array.from({ length: 99 }, (_, i) => ({ num: i + 1 }))

const rotation = ref(0)
const startAngle = ref(0)
const isDown = ref(false)
const radius = 450 // Distance from center
const carouselCenter = ref({ x: 0, y: 0 })

const speedWheel = 0.5

// Calculate which item is currently active (at 225 degrees / top-left position)
const activeIndex = computed(() => {
  const totalItems = carouselItems.length
  const anglePerItem = 360 / totalItems
  // Calculate which index has an angle closest to 225 degrees
  // For each item: angle = (360 / totalItems) * index + rotation.value
  // We want to find index where angle = 225
  // So: index = (225 - rotation.value) / anglePerItem
  let index = Math.round((225 - rotation.value) / anglePerItem)
  // Normalize to 0 to totalItems-1 range
  index = ((index % totalItems) + totalItems) % totalItems
  return index
})

// Watch for changes to active index and log it
watch(activeIndex, (newIndex) => {
  console.log('Active number:', carouselItems[newIndex].num)
})

const getItemStyle = (index) => {
  const totalItems = carouselItems.length
  const angle = (360 / totalItems) * index + rotation.value
  const rad = (angle * Math.PI) / 180
  
  // Calculate position on circle
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius
  
  // Target position is at 225 degrees (top-left)
  const targetRad = (225 * Math.PI) / 180
  const targetX = Math.cos(targetRad) * radius
  const targetY = Math.sin(targetRad) * radius
  
  // Calculate distance from target position
  const distanceFromTarget = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2))
  
  // Calculate z-index based on distance from target
  const zIndex = Math.round(1000 - distanceFromTarget)
  
  // Calculate scale based on distance from target (closer = larger)
  const maxDistance = radius * 2
  const scale = 0.6 + (1 - distanceFromTarget / maxDistance) * 0.6
  
  // Calculate opacity based on distance
  const opacity = 0.4 + (1 - distanceFromTarget / maxDistance) * 0.6
  
  // Set color to white if this is the active item, gray otherwise
  const color = index === activeIndex.value ? 'rgb(255, 255, 255)' : 'rgb(118, 118, 118)'
  
  return {
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
    zIndex: zIndex,
    opacity: opacity,
    color: color
  }
}

const handleItemClick = (index) => {
  const totalItems = carouselItems.length
  const targetAngle = -(360 / totalItems) * index + 225
  rotation.value = targetAngle
}

const handleWheel = (e) => {
  e.preventDefault()
  rotation.value += e.deltaY * speedWheel
}

const getAngleFromCenter = (clientX, clientY) => {
  const dx = clientX - carouselCenter.value.x
  const dy = clientY - carouselCenter.value.y
  return Math.atan2(dy, dx) * (180 / Math.PI)
}

const handleMouseMove = (e) => {
  if (!isDown.value) return
  
  e.preventDefault()
  
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const y = e.clientY || (e.touches && e.touches[0].clientY) || 0
  
  // Calculate current angle from center
  const currentAngle = getAngleFromCenter(x, y)
  
  // Calculate angle difference and update rotation
  const angleDiff = currentAngle - startAngle.value
  rotation.value += angleDiff
  
  // Update start angle for next frame
  startAngle.value = currentAngle
}

const handleMouseDown = (e) => {
  e.preventDefault()
  isDown.value = true
  
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
  // Calculate carousel center position
  const carouselEl = document.querySelector('.carousel')
  if (carouselEl) {
    const rect = carouselEl.getBoundingClientRect()
    carouselCenter.value = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
  }
  
  const y = e.clientY || (e.touches && e.touches[0].clientY) || 0
  
  // Calculate and store the initial angle from center
  startAngle.value = getAngleFromCenter(x, y)
}

const handleMouseUp = () => {
  isDown.value = false
}

onMounted(() => {
  const carouselEl = document.querySelector('.carousel')
  
  if (carouselEl) {
    carouselEl.addEventListener('wheel', handleWheel, { passive: false })
    carouselEl.addEventListener('mousedown', handleMouseDown)
    carouselEl.addEventListener('touchstart', handleMouseDown, { passive: false })
  }
  
  // Keep mousemove and mouseup on document for smooth dragging
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchmove', handleMouseMove, { passive: false })
  document.addEventListener('touchend', handleMouseUp)
})

onBeforeUnmount(() => {
  const carouselEl = document.querySelector('.carousel')
  
  if (carouselEl) {
    carouselEl.removeEventListener('wheel', handleWheel)
    carouselEl.removeEventListener('mousedown', handleMouseDown)
    carouselEl.removeEventListener('touchstart', handleMouseDown)
  }
  
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleMouseMove)
  document.removeEventListener('touchend', handleMouseUp)
})
</script>

<style scoped>
.carousel-wrapper {
  position: fixed;
  overflow: hidden;
  font-family: 'Roboto', serif;
  /* background: linear-gradient(135deg, black, #220033); */
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  pointer-events: none;
  touch-action: none;
}

.carousel {
  position: absolute;
  width: 950px;
  height: 950px;
  display: flex;
  justify-content: center;
  align-items: center;
  right: -75%;
  bottom: -75%;
  pointer-events: all;
}

.carousel-item {
  position: absolute;
  width: 100px;
  height: 160px;
  border-radius: 12px;
  overflow: visible;
  cursor: pointer;
  user-select: none;
  /* box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6); */
  /* background: black; */
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-box:before {
  content: '';
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: linear-gradient(to bottom, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, .6)); */
}

.num {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: bold;
}
</style>