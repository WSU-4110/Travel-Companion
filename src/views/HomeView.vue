<template>
  <div class="home">
    <h3 v-if="username">Welcome {{ username }}!</h3>
    <div class="container-fluid">
      <div class="row row-cols-1 row-cols-md-2">
        <div class="col mb-4">
          <TripOverview
            title="Translations"
            subtitle="Previously saved translations"
            subheader="Showing two most recent translations:"
            :bodyContent="recentTranslations"
            route="/translator"/>
        </div>
        <div class="col mb-4">
          <TripOverview
            title="Locations"
            subtitle="Previously saved locations"
            subheader="Showing five most recently saved locations:"
            :bodyContent="recentLocations"
            route="/userlocation"/>
        </div>
        <div class="col mb-4">
          <TripOverview
            title="Itineraries"
            subtitle="Previously saved itineraries"
            subheader="Showing most recent itineraries:"
            :bodyContent="recentItineraries"
            route="/AI"/>
        </div>
        <div class="col mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Other Tools</h5>
              <h6 class="card-subtitle mb-2 text-muted">Some other useful trip planning tools</h6>
              <div class="card-text">
                <router-link to="/currencyExchange">Currency Converter</router-link> <br>
                <router-link to="/Weather">Weather Forecaster</router-link>
              </div>
            </div>
            <div class="card-footer">
              Click a link to navigate to the tool
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TripOverview from '@/components/TripOverview.vue';
export default {
  components: {TripOverview},
  computed: {
    username() {
      return this.$store.getters.getUsername;
    },
    recentTranslations() {
      if (!this.$store.getters.getCurrentTrip || !this.$store.getters.getSavedTranslations) {
        return "No saved translations for trip";
      }

      return this.$store.getters.getSavedTranslations
        .split('---------------------------------------------')
        .slice(-3)
        .join('---------------------------------------------')
        .replace(/^\n/, '');
    },
    recentLocations() {
      if (!this.$store.getters.getCurrentTrip || !this.$store.getters.getSavedLocations) {
        return "No saved locations for trip";
      }

      return this.$store.getters.getSavedLocations
        .split('---------------------------------------------')
        .slice(-3)
        .join('---------------------------------------------')
        .replace(/^\n/, '');
    },
    recentItineraries() {
      // if (!this.$store.getters.getCurrentTrip || !this.$store.getters.getSavedItineraries) {
      //   return "No saved itineraries for trip";
      // }

      return "There are no saved itineraries at the moment, so here is some filler text to keep you gremlins satisfied \n\n\n\n";
    }
  }
}
</script>

<style scoped>

</style>
