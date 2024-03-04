<template>
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
        }
      }
    }
  }
  </script>
