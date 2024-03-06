<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <Sidebar /> <!-- Add Sidebar To Page -->
  <div :style="{'margin-left' : sidebarWidth }">
    <header>
      <img @click="clickLogo" alt="Vue logo" class="logo" src="@/assets/scalable-logo.svg"/>
    </header>
    <div v-if="alertStatus" class="alert alert-dismissible fade show" :class="alertStatus" role="alert">
      {{ alertMessage }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="dismissAlert"></button>
    </div>
    <TripSelector v-if="username"/>
    <RouterView />
  </div>
</template>

<script>
import { userVerificationAdapter } from '@/main';
import { sidebarWidth } from '@/components/state' //Import sidebarWidth
import Sidebar from '@/components/Sidebar.vue' //Import Sidebar
import TripSelector from '@/components/TripSelector.vue';

export default {
  components: {Sidebar, TripSelector},
  created () {
    this.$store.commit('setUsername', userVerificationAdapter.getUserAccount());
    this.$store.commit('setAiApiKey', localStorage.getItem("aiKey"));
    this.$store.commit('setCurrencyApiKey', localStorage.getItem("currencyKey"));
    this.$store.commit('setLocationApiKey', localStorage.getItem("locationKey"));
    this.$store.commit('setTranslationApiKey', localStorage.getItem("translationKey"));
    this.$store.commit('setWeatherApiKey', localStorage.getItem("weatherKey"));
  },
  computed: {
    username() {
      return this.$store.getters.getUsername;
    },
    alertStatus() {
      return this.$store.getters.getAlertStatus;
    },
    alertMessage() {
      return this.$store.getters.getAlertMessage;
    }
  },
  methods: {
    clickLogo() {
      this.$router.push('/');
    },
    dismissAlert() {
      this.$store.commit('setAlertStatus', null);
      this.$store.commit('setAlertMessage', '');
    }
  }
}
</script>

<style scoped>

.logo {
  cursor: pointer;
  display: block;
  margin: 0 auto 2rem;
  width: 150px;
}
</style>
