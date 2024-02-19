<template>
    <!-- UserLocation component template -->
    <section class="ui two column centered grid">
        <div class="column">
            <!-- Form for entering address -->
            <form class="ui segment large form">
                <!-- Error message display -->
                <div class="ui message red" v-show="error">{{ error }}</div>
                <div class="ui segment">
                    <!-- Input field for address -->
                    <div class="field">
                        <div class="ui right icon input large" :class="{ loading: spinner }">
                            <input type="text" placeholder="Enter an address" v-model="address" />
                            <!-- Locator button to get current location -->
                            <i class="dot circle link icon" @click="LocatorButtonPressed"></i>
                        </div>
                    </div>
                    <!-- Search button to search for entered address -->
                    <button class="ui button" @click.prevent="updateMap(address)">Search</button>
                </div>
            </form>
            <!-- MapView component to display the map -->
            <MapView ref="mapView" />
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
                // Error message
                error: "",
                // Loading spinner flag
                spinner: false
            }
        },
        methods: {
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
                            // Get address from coordinates
                            this.getAddressFrom(latitude, longitude);
                        },
                        // Handle errors
                        error => {
                            this.error = error.message;
                            this.spinner = false;
                        }
                    );
                } else {
                    this.error = "Your browser does not support geolocation API";
                    this.spinner = false;
                }
            },
            // Method to get address from coordinates
            async getAddressFrom(lat, long) {
                try {
                    // Make API request to geocode coordinates
                    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyB9dIA3ARjEmjIiiuBMjxSo-GgfEIudD4o");
                    if (response.data.error_message) {
                        console.log(response.data.error_message);
                        this.error = "Error: " + response.data.error_message;
                    } else {
                        // Set address to formatted address from API response
                        this.address = response.data.results[0].formatted_address;
                    }
                } catch (error) {
                    console.log(error.message);
                    this.error = "Error: Failed to fetch address. Please try again later.";
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
    /* Styles for buttons and icons */
    .ui.button,
    .dot.circle.icon {
        background-color: #808080;
        color: white;
    }
</style>
