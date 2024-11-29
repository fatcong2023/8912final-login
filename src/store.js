import { createStore } from 'vuex';

export default createStore({
  state: {
    username: ''
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    }
  },
  actions: {
    setUsername({ commit }, username) {
      commit('setUsername', username);
    }
  },
  getters: {
    getUsername: state => state.username
  }
});