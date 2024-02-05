<template>
  <div class="sign-in-page">
    <p>This is the sign up/sign in page</p>
    <div v-if="action === 'signIn'">
      <h2>Sign In</h2>
      <p>Are you a new user? Click <button @click="toggleSignInSignUp">here</button> to create a new account</p>
      <div :class="this.alertStatus === 'warning' ? 'warning' : 'information'" v-if="alertStatus !== ''">
        <p>{{ alertMessage }}</p>
      </div>
      <form>
        <label for="username-input">Username:</label><br>
        <input type="text" id="username-input" v-model="this.username"><br>
        <label for="password-input">Password:</label><br>
        <input type="password" id="password-input" v-model="this.password"><br>
        <input type="button" value="Sign In" :disabled="!signInButtonActive" @click="signIn">
      </form>
    </div>
    <div v-else>
      <h2>Sign Up</h2>
      <p>Already have an account? Click <button @click="toggleSignInSignUp">here</button> to sign in</p>
      <div :class="this.alertStatus === 'warning' ? 'warning' : 'information'" v-if="alertStatus !== ''">
        <p>{{ alertMessage }}</p>
      </div>
      <form>
        <label for="username-input">Username:</label><br>
        <input type="text" id="username-input" v-model="this.username"><br>
        <label for="email-input">Email:</label><br>
        <input type="email" id="email-input" v-model="this.email"><br>
        <label for="password-input">Password:</label><br>
        <input type="password" id="password-input" v-model="this.password"><br>
        <input type="button" value="Sign In" :disabled="!signInButtonActive" @click="createUser">
      </form>
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
      alertStatus: '',
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
    async signIn() {
      await verifyCredentials(this.username, this.password).then((session) => {
        this.alertStatus = 'information';
        this.alertMessage = 'Successfully signed in';
      })
      .catch((error) => {
        console.log("Authentication failed:", error);
        this.alertStatus = 'warning';
        this.alertMessage = error.message;
      });
    },
    async createUser() {
      await createNewUser(this.username, this.password, this.email).then((result) => {
        this.alertStatus = 'information';
        this.alertMessage = 'Successfully created user';
      })
      .catch((error) => {
        console.log("create failed", error);
        this.alertStatus = 'warning';
        this.alertMessage = error.message;
      });
    },
    toggleSignInSignUp() {
      this.action = this.action === 'signIn' ? 'signUp' : 'signIn';
      this.clearInputs();
    },
    clearInputs() {
      this.alertMessage = "";
      this.alertStatus = false;
      this.username = null;
      this.password = null;
      this.email = null;
    }
  }
}
</script>

<style scoped>
.information {
  background-color: #71cbff;
}
.warning {
  background-color: #ee7070;
}
</style>
