<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/scalable-logo.svg"/>
    <div class="wrapper">
      <nav>
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/signIn" class="nav-link">Sign in</RouterLink>
        <button v-if="username" @click="signUserOut">Sign out {{ username }}</button>
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
    }
  }
}
</script>

<style scoped>
/* changes style of main 'wrapper' view */

.nav-link {
  padding-right: 1rem;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
  width: 150px;
}
</style>
