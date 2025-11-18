import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import About from '@/pages/About.vue';
import Exercise from '@/components/Exercise.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      component: Home,
      children: [
        { path: 'exercise/:exerciseName', component: Exercise, props: true },
      ]
    },
    { path: '/about', component: About },
    // {
    //   path: '/exercise/:exerciseName',
    //   component: Exercise,
    //   props: true,
    // }
  ],
})

export default router
