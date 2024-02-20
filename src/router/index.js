import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignInSignUp from '@/views/SignInSignUpView.vue'
import TripManager from '@/views/TripManagerView.vue'
import AboutUs from '@/views/AboutUs.vue'
import UserLocation from '@/views/UserLocation.vue'
import CurrencyExchange from '@/views/currencyExchange.vue'
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
      path: '/aboutUs',
      name: 'About Us',
      component: AboutUs
    },
    {
      path: '/UserLocation',
      name: 'User Location',
      component: UserLocation
    },
    {
      path: '/currencyExchange',
      name: 'Currency Exchange',
      component: CurrencyExchange
    },
    {
      path: '/Weather',
      name: 'Weather',
      component: Weather
    }
  ]
})

export default router
