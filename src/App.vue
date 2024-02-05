<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img @click="clickLogo" alt="Vue logo" class="logo" src="@/assets/scalable-logo.svg"/>
    <div class="wrapper">
      <nav>
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink v-if="!username" to="/signIn" class="nav-link">Sign in</RouterLink>
        <button v-if="username" type="button" class="btn btn-secondary btn-sm" @click="signUserOut" style="margin-left: auto;">Sign Out {{ username }}</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script>
import { getUserAccount } from './api/userVerification';
import { signCurrentUserOut } from './api/userVerification';

export default {
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
      this.$router.push('/signIn');
    },
    clickLogo() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
nav {
  display: flex;
}

.nav-link {
  padding-right: 1rem;
  text-decoration: underline;
}

.logo {
  cursor: pointer;
  display: block;
  margin: 0 auto 2rem;
  width: 150px;
}
</style>
