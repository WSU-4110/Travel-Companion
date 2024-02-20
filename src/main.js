import './assets/main.css'

import * as bootstrap from 'bootstrap'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'

import '@fortawesome/fontawesome-free/js/all'

const store = createStore({
  state () {
    return {
      username: null,
      weatherApiKey: null
    }
  },
  getters: {
    getUsername(state) {
      return state.username;
    },
    getWeatherApiKey(state) {
      return state.weatherApiKey;
    }
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setWeatherApiKey(state, key) {
      state.weatherApiKey = key;
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
