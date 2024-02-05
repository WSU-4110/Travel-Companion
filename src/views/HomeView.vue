<template>
  <div class="home">
    <h3 v-if="username">Welcome {{ username }}!</h3>

    <!-- for now the translator is here, ideally we will -->
    <!-- have a translator view/page which will use the component, -->
    <!-- but it's here for now -->
    <translator/>
  </div>
</template>

<script>
import translator from '@/components/translator.vue';
import { isUserSignedIn } from '@/api/userVerification';

export default {
  components: {
    translator
  },
  mounted() {
    if (!isUserSignedIn()) {
      this.$router.push('/signIn');
    }
  },
  computed: {
    username() {
      return this.$store.getters.getUsername;
    }
  }
}
</script>

<style scoped>

</style>
