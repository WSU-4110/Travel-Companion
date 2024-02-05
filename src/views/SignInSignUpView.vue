<template>
  <div class="sign-in-page">
    <div v-if="alertStatus" class="alert alert-dismissible fade show" :class="alertStatus" role="alert">
      {{ alertMessage }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="dismissAlert"></button>
    </div>
    <div v-if="action === 'signIn'">
      <h2>Sign In</h2>
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
        :disabled="!signInButtonActive">
        Sign In
      </button>
      <hr class="mt-2 mb-3"/>
      <p>Are you a new user? <a @click="toggleSignInSignUp" class="link-button">Create a new account</a></p>
    </div>
    <div v-else>
      <h2>Sign Up</h2>
      <div class="form-floating mb-2 w-50">
        <input type="text" class="form-control" id="floatingInput" placeholder="user123" v-model="username">
        <label for="floatingInput">Username</label>
      </div>
      <div class="form-floating mb-2 w-50">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="email">
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating mb-2 w-50">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password">
        <label for="floatingPassword">Password</label>
      </div>
      <button
        class="btn btn-primary"
        @click="createUser"
        :disabled="!signInButtonActive">
        Sign Up
      </button>
      <hr class="mt-2 mb-3"/>
      <p>Already have an account? <a @click="toggleSignInSignUp" class="link-button">Sign in</a></p>
    </div>
  </div>
</template>

<script>
import { createNewUser } from '@/api/userVerification';
import { verifyCredentials } from '@/api/userVerification';

export default {
  data () {
    return {
      action: 'signIn',
      alertMessage: '',
      alertStatus: null,
      username: null,
      password: null,
      email: null
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
    testFunc() {
      console.log("mmm");
    },
    async signIn() {
      await verifyCredentials(this.username, this.password).then((session) => {
        this.alertStatus = 'alert-success';
        this.alertMessage = 'Successfully signed in';
      })
      .catch((error) => {
        console.log("Authentication failed:", error);
        this.alertStatus = 'alert-danger';
        this.alertMessage = error.message;
      });
    },
    async createUser() {
      await createNewUser(this.username, this.password, this.email).then((result) => {
        this.alertStatus = 'alert-success';
        this.alertMessage = 'Successfully created user';
      })
      .catch((error) => {
        console.log("create failed", error);
        this.alertStatus = 'alert-danger';
        this.alertMessage = error.message;
      });
    },
    toggleSignInSignUp() {
      this.action = this.action === 'signIn' ? 'signUp' : 'signIn';
      this.clearInputs();
    },
    clearInputs() {
      this.dismissAlert();
      this.username = null;
      this.password = null;
      this.email = null;
    },
    dismissAlert() {
      this.alertMessage = "";
      this.alertStatus = null;
    }
  }
}
</script>

<style scoped>
.link-button {
  cursor: pointer;
}
</style>
