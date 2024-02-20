import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignInSignUp from '@/views/SignInSignUpView.vue'
import TripManager from '@/views/TripManagerView.vue'
import UserLocation from '@/views/UserLocation.vue'
import Weather from '@/views/Weather.vue'

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
      },
    {
        path: '/UserLocation',
        name: 'User Location',
        component: UserLocation
      },
    {
          path: '/Weather',
          name: 'Weather',
          component: Weather
      }
  ]
})

export default router
