<template>
    <!-- Map container -->
    <div ref="mapContainer" class="map-container"></div>
</template>

<script>
    export default {
        props: {
            // Address received as prop from parent component
            address: {
                type: String,
                required: true
            },
            // Default zoom level for the map
            defaultZoom: {
                type: Number,
                default: 13 // Default zoom level
            },
            // Flag to indicate if search button is clicked
            searchClicked: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            // Watch for changes in address prop
            address(newValue) {
                // Update map only when search button is clicked
                if (this.searchClicked) {
                    this.updateMap(newValue);
                }
            }
        },
        mounted() {
            // Initialize the map when component is mounted
            this.initMap();
        },
        methods: {
            initMap() {
                // Initialize the map with default zoom and center coordinates
                this.map = new google.maps.Map(this.$refs.mapContainer, {
                    center: { lat: 42.3314, lng: -83.0458 }, // Default to center of the world
                    zoom: this.defaultZoom // Use default zoom level
                });
            },
            updateMap(address) {
                // Check if the address is not empty before performing geocoding
                if (address.trim() === '') {
                    console.warn('Empty address provided. Skipping geocoding.');
                    return; // Do not proceed with geocoding
                }

                // Use Geocoding API to get coordinates for the address
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        // Extract location from geocoding results
                        const location = results[0].geometry.location;
                        // Center the map to the location of the address
                        this.map.setCenter(location);
                        // Optionally, you can add a marker to the map at the location
                        const marker = new google.maps.Marker({
                            position: location,
                            map: this.map
                        });
                    } else {
                        console.error('Geocode was not successful for the following reason:', status);
                    }
                });
            }
        }
    };
</script>

<style scoped>
    /* Style for map container */
    .map-container {
        width: 100%;
        height: 300px; /* Adjust height as needed */
    }
</style>
