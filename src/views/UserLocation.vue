<template>
    <section class="ui two column centered grid">
        <div class="column">
            <form class="ui segment large form">
                <div class="ui message red" v-show="error">{{ error }} </div>
                <div class="ui segment">
                    <div class="field">
                        <div class="ui right icon input large" :class="{ loading: spinner }">
                            <input type="text" placeholder="Enter an address" v-model="address" />
                            <i class="dot circle link icon" @click="LocatorButtonPressed"></i>
                        </div>
                    </div>
                    <!-- Call updateMap method when search button is clicked -->
                    <button class="ui button" @click.prevent="updateMap(address)">Search</button>
                </div>
            </form>
            <!-- Pass address to MapView component -->
            <MapView ref="mapView" />
        </div>
    </section>
</template>

<script>
    import axios from 'axios'
    import MapView from '@/components/MapView.vue'

    export default {
        components: {
            MapView
        },
        data() {
            return {
                address: "",
                error: "",
                spinner: false
            }
        },
        methods: {
            LocatorButtonPressed() {
                this.spinner = true;
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            const latitude = position.coords.latitude;
                            const longitude = position.coords.longitude;
                            console.log("Latitude:", latitude);
                            console.log("Longitude:", longitude);
                            // You can use latitude and longitude here as needed
                            this.getAddressFrom(latitude, longitude);
                        },
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
            async getAddressFrom(lat, long) {
                try {
                    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyB9dIA3ARjEmjIiiuBMjxSo-GgfEIudD4o");
                    if (response.data.error_message) {
                        console.log(response.data.error_message);
                        this.error = "Error: " + response.data.error_message;
                    } else {
                        this.address = response.data.results[0].formatted_address;
                    }
                } catch (error) {
                    console.log(error.message);
                    this.error = "Error: Failed to fetch address. Please try again later.";
                }
            },
            // Update map with the provided address
            updateMap(address) {
                this.$refs.mapView.updateMap(address);
            }
        }
    };
</script>

<style>
    .ui.button,
    .dot.circle.icon {
        background-color: #808080;
        color: white;
    }
</style>
