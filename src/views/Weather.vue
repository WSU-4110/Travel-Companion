<template>
    <div>
        <form @submit.prevent="getWeather">
            <input v-model.trim="city" placeholder="Enter city" /> <!-- Note: OpenWeatherMap API expects a specific format for cities, for example, 'Detroit' or 'Detroit, US' for Detroit -->
            <button type="submit">Get Weather</button>
        </form>
        <div v-if="result.temp">
            <!-- Weather Display -->
            <p>Condition: {{ weather_main }}, {{ weather_description }}</p> <!-- Display weather description -->
            <p>Temperature: {{ convert_kelvin_to_fahrenheit(result.temp) }}°F ({{ convert_kelvin_to_celsius(result.temp) }}°C)</p> <!-- Displays temp in F and C -->
            <p>Feels Like: {{ convert_kelvin_to_fahrenheit(result.feels_like) }}°F ({{ convert_kelvin_to_celsius(result.feels_like) }}°C)</p> <!-- Displays feels like in F and C -->
            <p>Humidity: {{ result.humidity }}%</p> <!-- Displays air humidity -->
            <p>Pressure: {{ result.pressure }} hPa</p> <!-- Displays air pressure in hPa -->
            <p>Wind Speed: {{ convert_mps_to_mph(wind_speed) }} mph ({{ wind_speed }} m/s)</p> <!-- Displays wind speed in mph and m/s -->
            <p>Wind Direction: {{ wind_direction }}°</p> <!-- Display wind direction -->
            <p>Cloudiness: {{ clouds_percent }}%</p> <!-- Display cloud coverage -->
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
                };
            },
            methods:
            {
                convert_kelvin_to_celsius(kelvin) { return (kelvin - 273.15).toFixed(2); }, //OpenWeatherMap's API typically outputs in Kelvin, so we have to convert it. Here's the functions containing the formulas to do so
                convert_kelvin_to_fahrenheit(kelvin) { return ((kelvin - 273.15) * 1.8 + 32).toFixed(2); },
                convert_mps_to_mph(mps) { const mph = (mps * 2.23694).toFixed(2); return mph;}, //converting the default meters/second to miles/hour

                async getWeather() {
                    if (!this.city) return;
                    try {
                        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.$store.getters.getWeatherApiKey}`); //Calling the API
                        const data = await res.json();
                        if (data.main) {
                            this.result = data.main; //typing API's data.main output to our result function
                            this.weather_description = data.weather[0].description; //typing API's data.weather[0].description output to our description function
                            this.weather_main = data.weather[0].main; //typing API's data.weather[0].main output to our weather_main function
                            this.wind_speed = data.wind.speed; //typing API's data.wind.speed function to our wind_speed function
                            this.wind_direction = data.wind.deg || 0; // tying API's data.wind.deg output to our wind_direction function
                            this.clouds_percent = data.clouds.all; // typing API's data.clouds.all output to our clouds_percent function
                        }
                        else //Error Handling
                        { console.error('No weather data found'); }
                    }
                    catch (error) //Error Handling
                    { console.error('Error fetching weather data:', error); }
                },

            }
        };
</script>
