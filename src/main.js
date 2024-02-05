import './assets/main.css'

import * as bootstrap from 'bootstrap'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'

const store = createStore({
  state () {
    return {
      storeTest: 0
    }
  },
  mutations: {},
  actions: {},
  modules: {}
});

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');
