import { createStore } from 'vuex'

import persistedstate from 'vuex-persistedstate';

const store = createStore({
  state() {
    return {
      user: {
        user_id: '',
        user_no: '',
        user_tp: ''
      }
    }
  },
  mutations: {
    user(state, data){
      state.user = data;
    }
  },
  plugins: [
    persistedstate({
      paths: ['user']
    })
  ]
});

export default store;