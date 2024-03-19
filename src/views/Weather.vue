<template>
    <div>
        <form @submit.prevent="getWeather">
            <input v-model.trim="city" placeholder="Enter city" /> <!-- Note: OpenWeatherMap API expects a specific format for cities, for example, 'Detroit' or 'Detroit, US' for Detroit -->
            <button type="submit">Get Weather</button>
        </form>
        <div v-if="result.temp">
            <!-- Weather Display -->
            <p><b>Coordinates:</b> {{ latitude }}, {{ longitude }}</p>
            <img v-if="weather_icon" :src="`https://openweathermap.org/img/wn/${weather_icon}@2x.png`" alt="Weather Icon" /> <!-- Display weather icon -->
            <p><b>Condition:</b> {{ weather_main }}, {{ weather_description }}</p> <!-- Display weather description -->
            <p><b>Temperature:</b> {{ convert_kelvin_to_fahrenheit(result.temp) }}°F ({{ convert_kelvin_to_celsius(result.temp) }}°C)</p> <!-- Displays temp in F and C -->
            <p><b>Feels Like:</b> {{ convert_kelvin_to_fahrenheit(result.feels_like) }}°F ({{ convert_kelvin_to_celsius(result.feels_like) }}°C)</p> <!-- Displays feels like in F and C -->
            <p><b>Humidity:</b> {{ result.humidity }}%</p> <!-- Displays air humidity -->
            <p><b>Pressure:</b> {{ result.pressure }} hPa</p> <!-- Displays air pressure in hPa -->
            <p><b>Wind Speed:</b> {{ convert_mps_to_mph(wind_speed) }} mph ({{ wind_speed }} m/s)</p> <!-- Displays wind speed in mph and m/s -->
            <p><b>Wind Direction:</b> {{ wind_direction }}° ({{ getWindDirectionLetter(wind_direction) }})</p> <!-- Display wind direction in degrees and letter direction --> <!-- Display wind direction -->
            <p><b>Cloudiness:</b> {{ clouds_percent }}%</p> <!-- Display cloud coverage -->
            <p>Weather provided by OpenWeather</p>
        </div>
        <div v-else>
            <p>No weather data found for {{ city }}</p> <!-- Error Handling -->
        </div>
    </div>
</template>

<script>
    export default
        {
            data() {
                return {
                    city: '', //Initalizing functions for the weather display
                    result: {},
                    weather_main: '',
                    Weather_description: '',
                    wind_speed: 0,
                    wind_direction: 0,
                    clouds_percent: 0,
                    latitude: 0,
                    longitude: 0,
                };
            },
            methods:
            {
                convert_kelvin_to_celsius(kelvin) { return (kelvin - 273.15).toFixed(2); }, //OpenWeatherMap's API typically outputs in Kelvin, so we have to convert it. Here's the functions containing the formulas to do so
                convert_kelvin_to_fahrenheit(kelvin) { return ((kelvin - 273.15) * 1.8 + 32).toFixed(2); },
                convert_mps_to_mph(mps) { const mph = (mps * 2.23694).toFixed(2); return mph; }, //converting the default meters/second to miles/hour
                // Method to get wind direction letter based on degrees
                getWindDirectionLetter(degrees) {
                    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
                    const index = Math.round(degrees / 45) % 8;
                    return directions[index];
                },

                async getWeather() {
                    if (!this.city) return;
                    try {
                        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.$store.getters.getWeatherApiKey}`); //Calling the API
                        const data = await res.json();
                        console.log(data.weather[0].icon); // Log the icon code received from the API response
                        if (data.main) {
                            this.result = data.main; //typing API's data.main output to our result function
                            this.weather_description = data.weather[0].description; //typing API's data.weather[0].description output to our description function
                            this.weather_main = data.weather[0].main; //typing API's data.weather[0].main output to our weather_main function
                            const iconCode = data.weather[0].icon; // Retrieving the icon code from the API
                            this.weather_icon = iconCode; //and making a function to inject the icon code into our icon URL
                            this.wind_speed = data.wind.speed; //typing API's data.wind.speed function to our wind_speed function
                            this.wind_direction = data.wind.deg || 0; // tying API's data.wind.deg output to our wind_direction function
                            this.clouds_percent = data.clouds.all; // typing API's data.clouds.all output to our clouds_percent function
                            this.latitude = data.coord.lat;
                            this.longitude = data.coord.lon;
                        }
                        else { //Error Handling
                          this.$store.commit('setAlertStatus', 'alert-warning');
                          this.$store.commit('setAlertMessage', `No weather data found for: ${this.city}`);
                        }
                    }
                    catch (error) { //Error Handling
                        this.$store.commit('setAlertStatus', 'alert-danger');
                        this.$store.commit('setAlertMessage', `Error fetching weather data: ${error}`);
                    }
                },

            },
        };
</script>
