<template>
  <div class="sign-in-page">
    <div v-if="action === 'signIn'">
      <h2>Sign In</h2>
      <form @submit.prevent="signIn">
        <div class="form-floating mb-2 w-50">
          <input type="text" class="form-control" id="floatingInput" placeholder="user123" v-model="username">
          <label for="floatingInput">Username</label>
        </div>
        <div class="form-floating mb-2 w-50">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password">
          <label for="floatingPassword">Password</label>
        </div>
        <button
          class="btn btn-primary"
          @click="signIn"
          :disabled="!signInButtonActive || isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Loading...' : 'Sign In' }}
        </button>
      </form>
      <hr class="mt-2 mb-3"/>
      <p>Are you a new user? <a @click="toggleSignInSignUp" class="link-button">Create a new account</a></p>
    </div>
    <div v-else>
      <h2>Sign Up</h2>
      <form @submit.prevent="createUser">
        <div class="form-floating mb-2 w-50">
          <input type="text" class="form-control" id="floatingInput" placeholder="user123" v-model="username">
          <label for="floatingInput">Username</label>
        </div>
        <div class="form-floating mb-2 w-50">
          <input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com" v-model="email">
          <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating mb-2 w-50">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password">
          <label for="floatingPassword">Password</label>
        </div>
        <button
          class="btn btn-primary"
          @click="createUser"
          :disabled="!signInButtonActive || isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Loading...' : 'Sign Up' }}
        </button>
      </form>
      <hr class="mt-2 mb-3"/>
      <p>Already have an account? <a @click="toggleSignInSignUp" class="link-button">Sign in</a></p>
    </div>
  </div>
</template>

<script>
import { cognitoAdapter } from '@/main';

export default {
  data () {
    return {
      action: 'signIn',
      username: null,
      password: null,
      email: null,
      isLoading: false
    }
  },
  computed: {
    signInButtonActive() {
      const baseRequirements = this.username && this.password?.length >= 8;
      if (this.action === 'signIn') {
        return baseRequirements;
      }
      else {
        return baseRequirements && this.email;
      }
    }
  },
  methods: {
    async signIn() {
      this.isLoading = true;
      await cognitoAdapter.verifyCredentials(this.username, this.password).then((session) => {
        this.$store.commit('setAlertStatus', 'alert-success');
        this.$store.commit('setAlertMessage', 'Successfully signed in');
      })
      .catch((error) => {
        this.$store.commit('setAlertStatus', 'alert-danger');
        this.$store.commit('setAlertMessage', error.message);
      });

      this.isLoading = false;
    },
    async createUser() {
      this.isLoading = true;
      await cognitoAdapter.createNewUser(this.username, this.password, this.email).then((result) => {
        this.$store.commit('setAlertStatus', 'alert-success');
        this.$store.commit('setAlertMessage', 'Successfully created user');
      })
      .catch((error) => {
        this.$store.commit('setAlertStatus', 'alert-danger');
        this.$store.commit('setAlertMessage', error.message);
      });

      this.isLoading = false;
    },
    toggleSignInSignUp() {
      this.action = this.action === 'signIn' ? 'signUp' : 'signIn';
      this.clearInputs();
    },
    clearInputs() {
      this.username = null;
      this.password = null;
      this.email = null;
    }
  }
}
</script>

<style scoped>
.link-button {
  cursor: pointer;
}
</style>
