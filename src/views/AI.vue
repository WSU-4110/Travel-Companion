<template>
<<<<<<< HEAD
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
        const response = await this.fetchItineraryFromAPI(destination, tripLength);
        const itinerary = this.processResponse(response);
        return itinerary;
      } catch (error) {
        console.error('Error:', error);
        return 'Sorry, something went wrong. Please try again later.';
      }
    },
    async fetchItineraryFromAPI(destination, tripLength) {
      return fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': ,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          prompt: `Suggest an itinerary for a ${tripLength}-day trip to ${destination}.`,
          max_tokens: 150,
        }),
      });
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
    async handleSubmit() {
      if (this.itinerary && !this.generatingNewItinerary) {
        // pop-up if user tries to generate a new itinerary without saving current one
        if (confirm("Are you sure you don't want to save your current itinerary? Your current option will be lost.")) {
          this.generatingNewItinerary = true;
          await this.fetchAndDisplayItinerary();
=======
  <div>
    <form @submit.prevent="handleSubmit">
      <label for="destination">Enter destination:</label>
      <input type="text" id="destination" v-model="destination" required>
      <button type="submit">Get Itinerary</button>
    </form>
    <div id="itinerary">{{ itinerary }}</div>
  </div>
</template>

  <script>
  export default {
    data() {
      return {
        destination: '',
        itinerary: ''
      }
    },
    methods: {
      async suggestItinerary(destination) {
        try {
          const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer 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',
            },
            body: JSON.stringify({
              model: 'text-davinci-003',
              prompt: `Suggest an itinerary for traveling to ${destination}.`,
              max_tokens: 150,
            }),
          });
          const data = await response.json();
          return data.choices[0].text.trim();
        } catch (error) {
          console.error('Error:', error);
          this.$store.commit('setAlertStatus', 'alert-danger');
          this.$store.commit('setAlertMessage', 'Sorry, something went wrong. Please try again later.');
          return '';
        }
      },
      displayItinerary(itinerary) {
        this.itinerary = itinerary;
      },
      async handleSubmit() {
        try {
          const itinerary = await this.suggestItinerary(this.destination);
          this.displayItinerary(itinerary);
        } catch (error) {
          console.error(error);
>>>>>>> development
        }
      } else {
        this.generatingNewItinerary = true;
        await this.fetchAndDisplayItinerary();
      }
    },
    async fetchAndDisplayItinerary() {
      try {
        const itinerary = await this.suggestItinerary(this.destination, this.tripLength);
        this.displayItinerary(itinerary);
      } catch (error) {
        console.error(error);
      }
    },
    generateDifferentItinerary() {
      this.handleSubmit(); // handleSubmit to handle generating a different itinerary
    },
    saveItinerary() {
      // event to pass the itinerary data to the parent component
      this.$emit('save-itinerary', this.itinerary);
    }
  }
<<<<<<< HEAD
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
=======
  </script>
>>>>>>> development
