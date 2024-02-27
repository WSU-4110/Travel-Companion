<template>

<center>

  <h4>Welcome to the translator page!</h4>

</center>


  <div class="translator-container">
    <textarea class="input-text" v-model="inputText" placeholder="Enter text to translate"></textarea>

    <div class="language-selectors">

      <select class="language-selector" v-model="sourceLanguage">
        <option v-for="language in languages" :key="language.code" :value="language.code">{{ language.name }}</option>
      </select>


      <span class="arrow" @click="swapLanguages">&#x21C4;</span> <!-- Unicode symbol for up-down arrow -->

      <select class="language-selector" v-model="targetLanguage">
        <option v-for="language in languages" :key="language.code" :value="language.code">{{ language.name }}</option>
      </select>

    </div>


   <!-- <button class="translate-button" @click="translate">Translate</button> -->
    <div class="d-grid gap-2">
      <button class="btn btn-primary" type="button">Translate</button>
      <br>
   </div>



    <textarea class="translated-text" v-model="translatedText" placeholder="Translated text" readonly></textarea>
  </div>
</template>

<script>
import axios from 'axios'; // Import Axios

export default {
  data() {
    return {
      inputText: '',
      sourceLanguage: 'en',
      targetLanguage: 'es',
      translatedText: '',
      languages: [
        { code: 'en', name: 'English' },
        { code: 'Ar', name: 'Arabic' },
        { code: 'es', name: 'Spanish' },
        { code: 'ge', name: 'German' },
        { code: 'ja', name: 'Japanese' },
        { code: 'fr', name: 'French' },


        // Add more languages as needed
      ]
    };
  },
  methods: {
    translate() {
      // Make API request to translation service
      // Example: using axios for making HTTP requests
      // Replace API_KEY with your actual API key
      axios.post('https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY', {
        q: this.inputText,
        source: this.sourceLanguage,
        target: this.targetLanguage
      })
      .then(response => {
        this.translatedText = response.data.data.translations[0].translatedText;
      })
      .catch(error => {
        console.error('Translation error:', error);
      });
    }
  }
};
</script>

<style scoped>
.translator-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.input-text,
.language-selectors,
.translate-button,
.translated-text {
  width: 100%;
  margin-bottom: 10px;
}

.language-selector {
  width: calc(49% - 10px);
}

.arrow {
  font-size: 20px;
  margin: 0 5px;
}

.translate-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px;
  cursor: pointer;
}

.translate-button:hover {
  background-color: #0056b3;
}

.translated-text {
  height: 100px;
  resize: none;
}
</style>
