<template>
  <div class="translator">
    <p>This is the translator component</p>
    <button
      @click="testFunc">
      Translate some text!
    </button>
  </div>
</template>

<script>
import { translateFromText } from '@/api/translator';
export default {
  data () {
    return {
      test: 3
    }
  },
  methods: {
    testFunc() {
      alert(translateFromText("this doesn't work yet!"));
    }
  }
}
</script>

<style scoped>
div {
  background-color: #d5efff;
}
</style>
