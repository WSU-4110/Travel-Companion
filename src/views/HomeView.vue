<template>
  <div class="home">
    <p>This is the homepage</p>
    <translator/>
  </div>
</template>

<script>
import translator from '@/components/translator.vue';
export default {
  // for now just to show how this is done, ideally we will
  // have a translator view which will use the component
  components: {
    translator
  }
}
</script>

<style scoped>

</style>
