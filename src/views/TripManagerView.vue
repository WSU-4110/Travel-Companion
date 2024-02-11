<template>
  <div class="trip-manager">
    <p>This is the trip manager</p>
    <button
      class="btn btn-primary"
      @click="saveTrip">
      Test putting item
    </button>
    <button
      class="btn btn-primary"
      @click="getTrips">
      Test getting items
    </button>
    <div v-if="allTrips">
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          {{ currentTrip.tripName }}
        </button>
        <ul class="dropdown-menu">
          <li v-for="trip in allTrips"><a v-if="trip !== currentTrip" class="dropdown-item" @click="setCurrentTrip(trip)">{{ trip.tripName }}</a></li>
        </ul>
      </div>
      <p>Timestamp: {{ getTripTime }}</p>
    </div>
  </div>
</template>

<script>
import { getAllTrips, saveTrip } from '@/api/databaseManager';

export default {
  data () {
    return {
      allTrips: null,
      currentTrip: {}
    }
  },
  computed: {
    getTripTime() {
      if (!this.currentTrip) {
        return;
      }

      return new Date(this.currentTrip.timestamp).toLocaleString();
    }
  },
  methods: {
    async getTrips() {
      this.allTrips = await getAllTrips();
      if (!this.allTrips) {
        console.log("no trips to fetch");
        return;
      }
      this.setCurrentTrip(this.allTrips[0]);
      console.log(this.allTrips);
    },
    saveTrip() {
      // tempporary just to test fucntionality
      this.currentTrip.tripName = "trip" + Math.floor(Math.random() * 16);
      saveTrip(this.currentTrip);
    },
    setCurrentTrip(newTrip) {
      this.currentTrip = newTrip;
    }
  }
}
</script>

<style scoped>
.dropdown-item {
  cursor:pointer;
}
</style>
