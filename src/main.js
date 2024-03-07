import './assets/main.css'

import * as bootstrap from 'bootstrap'
import '@fortawesome/fontawesome-free/js/all'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import DynamoAdapter from '@/api/databaseManager'
import UserVerificationAdapter from '@/api/userVerification'

const dynamoAdapter = new DynamoAdapter();
const cognitoAdapter = new UserVerificationAdapter();

const store = createStore({
  state () {
    return {
      username: null,
      aiApiKey: null,
      currencyApiKey: null,
      locationApiKey: null,
      translationApiKey: null,
      weatherApiKey: null,
      alertStatus: null,
      alertMessage: '',
      allTrips: null,
      currentTrip: null
    }
  },
  getters: {
    getUsername(state) {
      return state.username;
    },
    getAiApiKey(state) {
      return state.aiApiKey;
    },
    getCurrencyApiKey(state) {
      return state.currencyApiKey;
    },
    getLocationApiKey(state) {
      return state.locationApiKey;
    },
    getTranslationApiKey(state) {
      return state.translationApiKey;
    },
    getWeatherApiKey(state) {
      return state.weatherApiKey;
    },
    getAlertStatus(state) {
      return state.alertStatus;
    },
    getAlertMessage(state) {
      return state.alertMessage;
    },
    getAllTrips(state) {
      return state.allTrips;
    },
    getCurrentTrip(state) {
      return state.currentTrip;
    }
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setAiApiKey(state, key) {
      state.aiApiKey = key;
      localStorage.setItem("aiKey", key);
    },
    setCurrencyApiKey(state, key) {
      state.currencyApiKey = key;
      localStorage.setItem("currencyKey", key);
    },
    setLocationApiKey(state, key) {
      state.locationApiKey = key;
      localStorage.setItem("locationKey", key);
    },
    setTranslationApiKey(state, key) {
      state.translationApiKey = key;
      localStorage.setItem("translationKey", key);
    },
    setWeatherApiKey(state, key) {
      state.weatherApiKey = key;
      localStorage.setItem("weatherKey", key);
    },
    setAlertStatus(state, status) {
      state.alertStatus = status;
    },
    setAlertMessage(state, message) {
      state.alertMessage = message;
    },
    setOrUpdateCurrentTrip(state, trip) {
      state.currentTrip = trip;
    }
  },
  actions: {
    async refreshAllTrips(context) {
      context.state.allTrips = await dynamoAdapter.getAllTrips();
    },
    resetStore(context) {
      context.state.allTrips = null;
      context.state.currentTrip = null;
      context.state.username = null;
    }
  },
  modules: {}
});

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');

export { dynamoAdapter };
export { cognitoAdapter };
export default store;
