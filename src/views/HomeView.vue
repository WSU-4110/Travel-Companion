<template>
  <div class="home">
    <h3 v-if="username">Welcome {{ username }}!</h3>
    <button @click="testFunc">
      mmmm
    </button>
  </div>
</template>

<script>
export default {
  computed: {
    username() {
      return this.$store.getters.getUsername;
    }
  },
  methods: {
    testFunc() {
      this.$store.commit('setAlertStatus', 'alert-success');
      this.$store.commit('setAlertMessage', 'tessttttt');
    }
  }
}
</script>

<style scoped>

</style>
