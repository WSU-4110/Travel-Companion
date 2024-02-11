import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignInSignUp from '@/views/SignInSignUpView.vue'
import TripManager from '@/views/TripManagerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/signIn',
      name: 'Sign In',
      component: SignInSignUp
    },
    {
      path: '/tripManager',
      name: 'Trip Manager',
      component: TripManager
    }
  ]
})

export default router
