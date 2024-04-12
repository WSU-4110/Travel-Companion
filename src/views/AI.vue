<template>
  <div>
    <h1 class="header">Welcome to the Itinerary Page</h1>
    <div class="container">
      <p class="prompt">Enter your destination and trip length below to get a personalized itinerary for your trip:</p>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="destination" class="input-label">Enter destination:</label>
          <input type="text" id="destination" v-model="destination" required class="input-field">
        </div>

        <div class="form-group">
          <label for="tripLength" class="input-label">Enter trip length (days):</label>
          <input type="number" id="tripLength" v-model.number="tripLength" required min="1" class="input-field">
        </div>
        
        <button type="submit">Generate Itinerary</button><br><br>
      </form>
      <div id="itinerary" v-if="itinerary">
        <div v-html="formattedItinerary" class="itinerary"></div>
        <div class="button-container">
          <br><button @click="generateDifferentItinerary">Generate a Different Itinerary</button>
          <button @click="saveItinerary">Save Itinerary</button>
        </div>
      </div>
      <div v-else>
        <p>No itinerary available yet. Please enter a destination and trip length.</p>
      </div>
    </div>
  </div>
</template>

<script>

//switched from just methods to class

import store from '@/main.js'
import axios from 'axios'

export default class AI {
  constructor() {
    this.destination = '';
    this.tripLength = 1;
    this.itinerary = '';
    this.generatingNewItinerary = false;
  }

  get formattedItinerary() {
    return this.itinerary.result.replace(/\n/g, '<br>'); // Convert newlines to HTML line breaks
  }

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
  }

  async handleSubmit() {
    if (!this.generatingNewItinerary) {
      this.generatingNewItinerary = true;
      try {
        await this.fetchAndDisplayItinerary();
      } finally {
        this.generatingNewItinerary = false;
      }
    }
  }

  async fetchAndDisplayItinerary() {
    try {
      this.itinerary = null; // Reset itinerary
      const itinerary = await this.suggestItinerary(this.destination, this.tripLength);
      this.displayItinerary(itinerary);
    } catch (error) {
      console.error(error);
    }
  }

  displayItinerary(itinerary) {
    this.itinerary = itinerary;
    this.generatingNewItinerary = false; // reset flag for generating new itinerary
  }

  generateDifferentItinerary() {
    this.handleSubmit(); // handleSubmit to handle generating a different itinerary
  }

  saveItinerary() {
    // event to pass the itinerary data to the parent component
    this.$emit('save-itinerary', this.itinerary);
  }
}
</script>

<style scoped>
.container {
  text-align: left;
}

.header {
  text-align: center;
}

.prompt {
  text-align: center;
}

.form-group {
  margin-bottom: 10px;
}

.input-label {
  display: block;
  margin-bottom: 5px;
}

.input-field {
  margin-bottom: 15px;
}

.button-container button {
  margin-right: 10px;
}
</style>
