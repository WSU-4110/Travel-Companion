<template>
  <div class="home">
    <h3 v-if="username">Welcome {{ username }}!</h3>
  </div>
</template>

<script>
export default {
  computed: {
    username() {
      return this.$store.getters.getUsername;
    }
  }
}
</script>

<style scoped>

</style>
