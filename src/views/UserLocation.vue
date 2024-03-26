<template>
    <!-- UserLocation component template -->
    <section class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <!-- Form for entering address -->
                <form @submit.prevent="updateMap(address); saveLocation(address)" class="mt-4">
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
                <!-- Button to save location to the current trip -->
                <button @click="saveLocationToTrip" class="btn btn-success mt-3">Save Location to Current Trip</button>
            </div>
        </div>
        <!-- Display box for saved locations -->
        <div class="row justify-content-center mt-4">
            <div class="col-md-6">
                <h4>Saved Locations</h4>
                <textarea class="form-control" rows="5" v-model="savedLocations" readonly></textarea>
            </div>
        </div>
    </section>
</template>

<script>
    // Import axios for HTTP requests
    import axios from 'axios'
    // Import MapView component
    import MapView from '@/components/MapView.vue'

    export default {
        components: {
            MapView
        },
        data() {
            return {
                // Address entered by the user
                address: "",
                // Latitude and longitude variables
                latitude: null,
                longitude: null,
                // Loading spinner flag
                spinner: false,
                // Variable to store saved locations
                savedLocations: "" // Initialize savedLocations variable
            }
        },
        methods: {


        async fetchLocation() {
            try {
                // Check if geolocation is supported
                if (navigator.geolocation) {
                    // Get current position
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            const latitude = position.coords.latitude;
                            const longitude = position.coords.longitude;
                            // Log latitude and longitude
                            console.log("Latitude:", latitude);
                            console.log("Longitude:", longitude);
                            // Set latitude and longitude
                            this.latitude = latitude;
                            this.longitude = longitude;
                            // Get address from coordinates
                            this.getAddressFrom(latitude, longitude);
                        },
                        // Handle errors
                        error => {
                            this.$store.commit('setAlertStatus', 'alert-danger');
                            this.$store.commit('setAlertMessage', error.message);
                        }
                    );
                } else {
                    this.$store.commit('setAlertStatus', 'alert-danger');
                    this.$store.commit('setAlertMessage', 'Your browser does not support geolocation API');
                }
                } catch (error) {
                    console.log(error.message);
                    this.$store.commit('setAlertStatus', 'alert-danger');
                    this.$store.commit('setAlertMessage', 'Error: Failed to fetch location. Please try again later');
                }
             },
            // Method to get the current location
            LocatorButtonPressed() {
                this.spinner = true;
                // Check if geolocation is supported
                if (navigator.geolocation) {
                    // Get current position
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            const latitude = position.coords.latitude;
                            const longitude = position.coords.longitude;
                            // Log latitude and longitude
                            console.log("Latitude:", latitude);
                            console.log("Longitude:", longitude);
                            // Set latitude and longitude
                            this.latitude = latitude;
                            this.longitude = longitude;
                            // Get address from coordinates
                            this.getAddressFrom(latitude, longitude);
                        },
                        // Handle errors
                        error => {
                            this.$store.commit('setAlertStatus', 'alert-danger');
                            this.$store.commit('setAlertMessage', error.message);
                            this.spinner = false;
                        }
                    );
                } else {
                    this.$store.commit('setAlertStatus', 'alert-danger');
                    this.$store.commit('setAlertMessage', 'Your browser does not support geolocation API');
                    this.spinner = false;
                }
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
            },
            // Method to save the location
            saveLocation() {
                if (this.latitude !== null && this.longitude !== null) {
                    this.savedLocations += `Address: ${this.address}\n`;
                    this.savedLocations += `Latitude: ${this.latitude} \nLongitude: ${this.longitude}\n`;
                    this.savedLocations += '---------------------------------------------\n';

                    // Emit an event to indicate that a location has been saved
                    this.$root.$emit('locationSaved', {
                        address: this.address,
                        latitude: this.latitude,
                        longitude: this.longitude
                    });
                } else {
                    console.error("Latitude and longitude are not available.");
                }
            },
            // Method to save location to the current trip
            saveLocationToTrip() {
                // Get the current trip from TripSelector component
                const currentTrip = this.$root.$refs.tripSelector.currentTrip;
                if (currentTrip) {
                    // Construct location object
                    const location = {
                        address: this.address,
                        latitude: this.latitude,
                        longitude: this.longitude
                    };
                    // Push location to the current trip's locations array
                    currentTrip.locations.push(location);
                    
                } else {
                    console.error("No current trip selected.");
                    // Handle the case when no trip is selected
                }
            }
        }
    };
</script>

<style>
    /* Add your custom styles here */
</style>
