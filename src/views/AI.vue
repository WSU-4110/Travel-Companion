<template>
  <div>
    <h1 class="header">Welcome to the Itinerary Page</h1>
    <div class="container">
      <p class="prompt">Enter your destination and trip length below to get a personalized itinerary for your trip:</p>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group w-25">
          <label for="destination" class="input-label">Enter destination:</label>
          <input type="text" id="destination" v-model="destination" required class="input-field form-control">
        </div>

        <div class="form-group w-25">
          <label for="tripLength" class="input-label">Enter trip length (days):</label>
          <input type="number" id="tripLength" v-model.number="tripLength" required min="1" class="input-field form-control">
        </div>

        <button class="btn btn-primary"type="submit">
          <span v-if="spinner" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Generate Itinerary
        </button><br><br>
      </form>
      <div id="itinerary" v-if="formattedItinerary">
        <pre class="itinerary-text">{{ formattedItinerary }}</pre>
        <div class="button-container">
          <ConfirmDelete
            targetType="Itinerary"
            :deleteCallback="deleteItinerary"
            :genericDelete="true"
            :disabled="!tripSelected || !formattedItinerary"/>
        </div>
      </div>
      <div v-else>
        <pre class="itinerary-text">No itinerary available yet. Please enter a destination and trip length.</pre>
      </div>
    </div>
  </div>
</template>


<script>
import store from '@/main.js'
import axios from 'axios'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
export default {
  components: {ConfirmDelete},
  data() {
    return {
      destination: '',
      tripLength: 1,
      itinerary: '',
      generatingNewItinerary: false,
      spinner: false,
      itinerary: null
    }
  },
  computed: {
    formattedItinerary() {
      return this.$store.getters.getSavedItineraries;
    },
    tripSelected() {
      return this.$store.getters.isTripSelected;
    }
  },
  methods: {
    async suggestItinerary(destination, tripLength) {
      this.spinner = true;
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
        this.spinner = false;
        return response.data;
      } catch (error) {
        console.error('Error:', error);
        this.spinner = false;
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

      this.saveItinerary();
    },
    displayItinerary(itinerary) {
      this.itinerary = itinerary;
      this.generatingNewItinerary = false; // reset flag for generating new itinerary
    },
    saveItinerary() {
      console.log('Save Itinerary clicked')
      if (this.tripSelected) {
        this.$store.commit('setOrUpdateItineraries',this.itinerary.result);
        this.$store.dispatch('saveTripToDB');
      }
    },
    deleteItinerary() {
      if (this.tripSelected) {
        this.itinerary - null;
        this.$store.commit('setOrUpdateItineraries', null);
        this.$store.dispatch('saveTripToDB');
      }
    }
  }
}
</script>

<style scoped>
.itinerary-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: inherit;
  overflow: auto;
  max-width: 100%;
  background: #ffffff;
  padding: 1rem;
  border-radius: 12px;

}
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
