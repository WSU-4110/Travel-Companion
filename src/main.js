import './assets/main.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'

const store = createStore({
  state () {
    return {
      username: null
    }
  },
  getters: {
    getUsername(state) {
      return state.username;
    }
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
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
