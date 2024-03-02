import './assets/main.css'

import * as bootstrap from 'bootstrap'
import '@fortawesome/fontawesome-free/js/all'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'

const store = createStore({
  state () {
    return {
      username: null,
      currencyApiKey: null,
      weatherApiKey: null,
      alertStatus: null,
      alertMessage: ''
    }
  },
  getters: {
    getUsername(state) {
      return state.username;
    },
    getCurrencyApiKey(state) {
      return state.currencyApiKey;
    },
    getWeatherApiKey(state) {
      return state.weatherApiKey;
    },
    getAlertStatus(state) {
      return state.alertStatus;
    },
    getAlertMessage(state) {
      return state.alertMessage;
    }
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setCurrencyApiKey(state, key) {
      state.currencyApiKey = key;
      localStorage.setItem("currencyKey", key);
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
    }
  },
  actions: {},
  modules: {}
});

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');

export default store;
