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
    <RouterView />
  </div>
</template>

<script>
import { getUserAccount } from './api/userVerification';
import { signCurrentUserOut } from './api/userVerification';
import Sidebar from '@/components/Sidebar.vue' //Import Sidebar
import { sidebarWidth } from '@/components/state' //Import sidebarWidth

export default {
  components: {Sidebar}, //Retrieve Sidebar Component and return sidebarWidth
  data () {
    return {
      alertStatus: null,
      alertMessage: ""
    }
  },
  created () {
    this.$store.commit('setUsername', getUserAccount());
  },
  computed: {
    username() {
      return this.$store.getters.getUsername;
    }
  },
  methods: {
    signUserOut() {
      signCurrentUserOut();
      this.alertMessage = "Successfully Signed Out";
      this.alertStatus = 'alert-success';
      this.$router.push('/signIn');
    },
    clickLogo() {
      this.$router.push('/');
    },
    dismissAlert() {
      this.alertMessage = "";
      this.alertStatus = null;
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
