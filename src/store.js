// store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    user: {
      email: '',
      password: '',
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    updateUser({ commit }, user) {
      commit('setUser', user);
    },
  },
  getters: {
    getUserEmail: (state) => state.user.email,
    getUserPassword: (state) => state.user.password,
  },
});
