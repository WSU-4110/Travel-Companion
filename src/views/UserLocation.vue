<template>
    <!-- UserLocation component template -->
    <section class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <!-- Form for entering address -->
          <form @submit.prevent="updateMap(address)" class="mt-4">
            <div class="input-group mb-3">
              <!-- Input field for address -->
              <input type="text" class="form-control" placeholder="Enter an address" v-model="address" />
              <!-- Locator button to get current location -->
              <button @click="LocatorButtonPressed" class="btn btn-outline-secondary" type="button">
                Get Location
              </button>
            </div>
            <!-- Search button to search for entered address -->
            <button type="submit" class="btn btn-primary">Search</button>
          </form>
          <!-- MapView component to display the map -->
          <MapView ref="mapView" />
        </div>
      </div>
    </section>
  </template>
  
  <script>
  // Import axios for HTTP requests
  import axios from 'axios';
  // Import MapView component
  import MapView from '@/components/MapView.vue';
  // Import GeolocationAdapter component
  import GeolocationAdapter from '@/components/GeolocationAdapter.vue';
  
  export default {
    components: {
      MapView,
      GeolocationAdapter
    },
    data() {
      return {
        // Address entered by the user
        address: "",
        // Loading spinner flag
        spinner: false
      };
    },
    methods: {
      // Method to get the current location
      LocatorButtonPressed() {
        this.spinner = true;
        // Use the adapter to get current position
        this.$refs.geolocationAdapter.getCurrentPosition(
          (latitude, longitude) => {
            // Log latitude and longitude
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            // Get address from coordinates
            this.getAddressFrom(latitude, longitude);
          },
          // Handle errors
          error => {
            this.$store.commit('setAlertStatus', 'alert-danger');
            this.$store.commit('setAlertMessage', error);
            this.spinner = false;
          }
        );
      },
      // Method to get address from coordinates
      async getAddressFrom(lat, long) {
        try {
          // Make API request to geocode coordinates
          const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${this.$store.getters.getLocationApiKey}`);
          if (response.data.error_message) {
            console.log(response.data.error_message);
            this.$store.commit('setAlertStatus', 'alert-danger');
            this.$store.commit('setAlertMessage', `Error ${response.data.error_message}`);
          } else {
            // Set address to formatted address from API response
            this.address = response.data.results[0].formatted_address;
          }
        } catch (error) {
          console.log(error.message);
          this.$store.commit('setAlertStatus', 'alert-danger');
          this.$store.commit('setAlertMessage', 'Error: Failed to fetch address. Please try again later');
        }
      },
      // Method to update map with provided address
      updateMap(address) {
        this.$refs.mapView.updateMap(address);
      }
    }
  };
  </script>
  
  <style>
  /* Add your custom styles here */
  </style>
  