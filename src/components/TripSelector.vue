<template>
  <div class="trip-selector d-flex justify-content-between">
    <div>
      <button
        @click="clearCreateModal"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#createModal">
        Create new Trip
      </button>
      <button
        v-if="!allTrips || (allTrips.length === 1 && currentTrip)"
        class="btn btn-secondary ms-2"
        disabled>
        {{ currentTrip?.tripName ? currentTrip.tripName : "You don't have any trips!" }}
      </button>
      <span v-else>
        <button class="btn btn-secondary dropdown-toggle ms-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          {{ currentTrip?.tripName ? currentTrip.tripName : 'Select a Trip' }}
        </button>
        <ul class="dropdown-menu">
          <li v-for="trip in allTrips"><a v-if="trip !== currentTrip" class="dropdown-item" @click="setCurrentTrip(trip)">{{ trip.tripName }}</a></li>
        </ul>
      </span>
      <span v-if="currentTrip" class="ms-2">Last modified: {{ tripTime }}</span>
    </div>
    <button
      v-if="currentTrip"
      class="btn btn-danger ms-2"
      data-bs-toggle="modal"
      data-bs-target="#deleteModal">
      Delete Trip
    </button>
  </div>
  <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="createModalLabel">Create New Trip</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <h6>Enter new trip information:</h6>
        <div class="form-group w-75">
          <label for="inputName">Trip Name:</label>
          <input v-model="newTripName" type="text" class="form-control" id="inputName" aria-describedby="tripName" placeholder="Enter trip name">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button @click="createNewTrip" type="button" class="btn btn-primary" data-bs-dismiss="modal">Create Trip</button>
      </div>
    </div>
  </div>
</div>
  <div v-if="currentTrip?.tripName" class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Trip "{{ currentTrip.tripName }}"?</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Are you sure you want to delete trip "{{ currentTrip.tripName }}"? This action <b>is not reversable</b>.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button @click="deleteCurrentTrip" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete Trip</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { deleteTrip } from '@/api/databaseManager';
import { saveTrip } from '@/api/databaseManager';

export default {
  name: 'TripSelector',
  data () {
    return {
      newTripName: null
    }
  },
  mounted () {
    setTimeout(this.refreshTrips, 100);
  },
  computed: {
    allTrips() {
      return this.$store.getters.getAllTrips;
    },
    currentTrip() {
      return this.$store.getters.getCurrentTrip;
    },
    tripTime() {
      return new Date(this.currentTrip.timestamp).toLocaleString();
    }
  },
  methods: {
    refreshTrips() {
      this.$store.dispatch('refreshAllTrips');
    },
    createNewTrip() {
      saveTrip({tripName: this.newTripName});
      setTimeout(() => this.$store.dispatch('refreshAllTrips'), 400);
      setTimeout(this.findNewTrip, 600);
    },
    findNewTrip() {
      const newTrip = this.allTrips.find(trip => trip.tripName === this.newTripName);
      this.$store.commit('setOrUpdateCurrentTrip', newTrip);
    },
    setCurrentTrip(trip) {
      this.$store.commit('setOrUpdateCurrentTrip', trip);
    },
    deleteCurrentTrip() {
      deleteTrip(this.currentTrip);
      this.$store.commit('setOrUpdateCurrentTrip', null);
      setTimeout(() => this.$store.dispatch('refreshAllTrips'), 300);
    },
    clearCreateModal() {
      this.newTripName = null;
    },

    mounted() {
    // Listen for the 'locationSaved' event emitted by other components
    this.$root.$on('locationSaved', (location) => {
        // Add the location to the current trip
        this.addLocationToCurrentTrip(location);
    });
},
methods: {
    addLocationToCurrentTrip(location) {
        if (this.currentTrip) {
            // Add the location to the current trip
            // Assuming locations is an array in your trip object
            this.currentTrip.locations.push(location);
        } else {
            console.error("No current trip selected.");
        }
    }
}
    
  }
}
</script>

<style scoped>
.trip-selector {
  margin-bottom: 1em;
  background-color: #a8d6ec;
  padding: 10px;
  border-radius: 10px;
}
</style>
