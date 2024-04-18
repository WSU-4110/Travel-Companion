<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ subtitle }}</h6>
      <p v-if="tripSelected" class="card-text">{{ subheader }}</p>
      <pre v-if="tripSelected" class="card-text">{{ bodyContent }}</pre>
      <p v-else class="card-text">Select or create a new trip to see trip details</p>
    </div>
    <div v-if="route" class="card-footer">
      For more detailed options, <router-link :to="route ? route : '/'">use this tool</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "TripOverview",
  props: {
    title: {type: String, required: true},
    bodyContent: {type: String},
    subtitle: {type: String},
    subheader: {type: String},
    route: {type: String},
  },
  computed: {
    tripSelected() {
      return this.$store.getters.isTripSelected;
    }
  }
}
</script>

<style scoped>
pre {
  background: #ececec;
  border-radius: 12px;
  padding: 1rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: inherit;
  /* Allow HTML formatting */
  overflow: auto;
  max-width: 100%;
}
</style>

