<template>
  <center>
    <h4>Welcome to the translator page!</h4>
  </center>

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
  //import axios from 'axios'; // Import Axios
  import 'bootstrap/dist/css/bootstrap.min.css';

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

