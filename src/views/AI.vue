<template>
  <div class="container">
    <h1>Welcome to the Itinerary Page</h1>
    <p>Enter your destination and trip length below to get a personalized itinerary for your trip:</p>
    <form @submit.prevent="handleSubmit">
      <label for="destination">Enter destination:</label>
      <input type="text" id="destination" v-model="destination" required>
      
      <label for="tripLength">Enter trip length (days):</label>
      <input type="number" id="tripLength" v-model.number="tripLength" required min="1">
      
      <button type="submit">Generate Itinerary</button>
    </form>
    <div id="itinerary" v-if="itinerary">
      <p>{{ itinerary }}</p>
      <button @click="generateDifferentItinerary">Generate a Different Itinerary</button>
      <button @click="saveItinerary">Save Itinerary</button>
    </div>
    <div v-else>
      <p>No itinerary available yet. Please enter a destination and trip length.</p>
    </div>
  </div>
</template>

<script>
import store from '@/main.js'
import axios from 'axios'
export default {
  data() {
    return {
      destination: '',
      tripLength: 1,
      itinerary: '',
      generatingNewItinerary: false
    }
  },
  methods: {
    async suggestItinerary(destination, tripLength) {
      try {
        const response = await axios.request({
          method: 'POST',
          url: 'https://open-ai21.p.rapidapi.com/conversationgpt35',
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': store.getters.getAiApiKey,
            'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
          },
          data: {
            messages: [
              {
                role: 'user',
                content: `Suggest an itinerary for a ${tripLength}-day trip to ${destination}.`
              }
            ],
            web_access: false,
            system_prompt: '',
            temperature: 0.9,
            top_k: 5,
            top_p: 0.9,
            max_tokens: 256
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error:', error);
        throw new Error('Sorry, something went wrong. Please try again later.');
      }
    },
    async handleSubmit() {
      if (this.itinerary && !this.generatingNewItinerary) {
        if (confirm("Are you sure you don't want to save your current itinerary? Your current option will be lost.")) {
          this.generatingNewItinerary = true;
          await this.fetchAndDisplayItinerary();
        }
      } else {
        this.generatingNewItinerary = true;
        await this.fetchAndDisplayItinerary();
      }
    },
    async fetchAndDisplayItinerary() {
      try {
        this.itinerary = null; // Reset itinerary
        const itinerary = await this.suggestItinerary(this.destination, this.tripLength);
        this.displayItinerary(itinerary);
      } catch (error) {
        console.error(error);
      }
    },
    processResponse(response) {
      return response.json().then(data => {
        return data.choices[0].text.trim();
      });
    },
    displayItinerary(itinerary) {
      this.itinerary = itinerary;
      this.generatingNewItinerary = false; // reset flag for generating new itinerary
    },
       generateDifferentItinerary() {
      this.handleSubmit(); // handleSubmit to handle generating a different itinerary
    },
    saveItinerary() {
      // event to pass the itinerary data to the parent component
      this.$emit('save-itinerary', this.itinerary);
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
