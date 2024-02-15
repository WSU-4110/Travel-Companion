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
    <button
      class="btn btn-primary"
      @click="deleteCurrentTrip">
      Test deleting item
    </button>
    <button
      class="btn btn-primary"
      @click="updateTrip">
      Test updating item in table
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
      <label for="update-username" class="form-label">Set new trip name:</label>
      <div class="input-group mb-3 w-50">
        <input ref="nameInput" id="update-username" type="text" class="form-control" placeholder="eg. Trip 1" aria-label="Trip Name" aria-describedby="button-addon2">
        <button @click="updateTripName" class="btn btn-secondary" type="button" id="button-addon2">Update Name</button>
      </div>
      <p>Timestamp: {{ getTripTime }}</p>
      <p>Coordinates: {{ getTripCoordinates }}</p>
    </div>
  </div>
</template>

<script>
import { deleteTrip, getAllTrips, saveTrip, updateTrip } from '@/api/databaseManager';

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
    },
    getTripCoordinates() {
      if (!this.currentTrip) {
        return;
      }

      return this.currentTrip.coordinates.latitude + ", " + this.currentTrip.coordinates.longitude;
    }
  },
  methods: {
    // these all are just to show how I intend for the manager to be used
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
      this.currentTrip.tripName = "trip" + Math.floor(Math.random() * 16);
      this.currentTrip.coordinates = {latitude: 40, longitude: -10};
      saveTrip(this.currentTrip);
      this.getTrips();
    },
    updateTrip() {
      updateTrip(this.currentTrip);
      this.getTrips();
    },
    deleteCurrentTrip() {
      deleteTrip(this.currentTrip);
      this.getTrips();
    },
    setCurrentTrip(newTrip) {
      this.currentTrip = newTrip;
    },
    updateTripName() {
      this.currentTrip.tripName = this.$refs.nameInput.value;
    }
  }
}
</script>

<style scoped>
.dropdown-item {
  cursor:pointer;
}
</style>
