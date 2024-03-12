<template>
    <div>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Itinerary Suggestion</title>
      </head>
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
        const response = await this.fetchItineraryFromAPI(destination);
        const itinerary = this.processResponse(response);
        return itinerary;
      } catch (error) {
        console.error('Error:', error);
        return 'Sorry, something went wrong. Please try again later.';
      }
    },
    async fetchItineraryFromAPI(destination) {
      return fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer API_KEY',
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: `Suggest an itinerary for traveling to ${destination}.`,
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
    },
    async handleSubmit() {
      try {
        const itinerary = await this.suggestItinerary(this.destination);
        this.displayItinerary(itinerary);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>