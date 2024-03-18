<template>
  <div class="text-center"><h4>Welcome to the translator page!</h4></div>
  <div class="translator-container">
    <textarea class="form-control" v-model="inputText" placeholder="Enter text to translate"></textarea>
    <br>
    <div class="language-selectors">
      <select class="form-select" v-model="sourceLanguage">
        <option v-for="language in languages" :key="language.code" :value="language.code">{{ language.name }}</option>
      </select>
      <span class="arrow" @click="swapLanguages">&#x21C4; <br> </span>
      <br>
      <select class="form-select" v-model="targetLanguage">
        <option v-for="language in languages" :key="language.code" :value="language.code">{{ language.name }}</option>
      </select>
    </div>
    <br>
    <div class="d-grid gap-2">
      <button class="btn btn-primary" type="button" @click="translate">Translate</button>
      <br>
    </div>
    <textarea class="form-control translated-text" v-model="translatedText" placeholder="Translated text" readonly></textarea>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/main.js';

export default {
  data() {
    return {
      inputText: '',
      sourceLanguage: 'EN',
      targetLanguage: 'ES',
      translatedText: '',
      languages: [
      ]
    };
  },
  methods: {
    //Method to fetch languages available by Translator Api
    async fetchLanguages() {
      const options = {
        method: 'GET',
        url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2/languages',
        headers: {
          'X-RapidAPI-Key': store.getters.getTranslationApiKey,
          'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
        }
      };
      try {
        const response = await axios.request(options);
        const availableLanguages = response.data.languages;
        // Map the available languages to the format you desire
        const formattedLanguages = availableLanguages.map(lang => ({
          code: lang.language,
          name: lang.name
        }));
        // Update the languages array
        this.languages = formattedLanguages;
      } catch (error) {
        console.error(error);
      }
    },
    async translate() {
      const options = {
        method: 'POST',
        url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': store.getters.getTranslationApiKey,
          'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
        },
        data: {
          source: this.sourceLanguage,
          target: this.targetLanguage,
          q: this.inputText
        }
      };
      try {
        const response = await axios.request(options);
        this.translatedText = response.data.data.translations.translatedText;
        console.log('Input: ', this.inputText)
        console.log('Response: ', response.data.data.translations.translatedText)
      } catch (error) {
        console.error(error);
        this.$store.commit('setAlertStatus', 'alert-danger');
        this.$store.commit('setAlertMessage', `Translation error: ${error}`);
      }
    }
  },
  //Mounting fetchLanguages to populate lists on page load
  mounted() {
    // Fetch available languages on component mount
    this.fetchLanguages();
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
.translate-button,
.translated-text {
  width: 100%;
  margin-bottom: 10px;
}

.language-selectors {
  display: flex;
  align-items: center;
}

.language-selectors select {
  width: calc(50% - 20px); /* Adjust the width as needed */
  margin-right: 10px;
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