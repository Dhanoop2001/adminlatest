// store.js
import { createStore } from 'vuex';
import axios from 'axios';

// Configure Axios with the base URL for the backend
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your Spring Boot backend's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default createStore({
  state: {
    user: {
      email: '',
      password: '',
    },
    isAuthenticated: false,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = !!user.email; // Set authentication status
    },
    logoutUser(state) {
      state.user = { email: '', password: '' };
      state.isAuthenticated = false;
    },
  },
  actions: {
    async signupUser({ commit }, user) {
      try {
        const response = await apiClient.post('/signup', user);
        commit('setUser', response.data);
        return response.data;
      } catch (error) {
        console.error('Error during signup:', error);
        throw error;
      }
    },
    async loginUser({ commit }, user) {
      try {
        const response = await apiClient.post('/login', user);
        commit('setUser', response.data);
        return response.data;
      } catch (error) {
        console.error('Error during login:', error);
        throw error;
      }
    },
    logoutUser({ commit }) {
      commit('logoutUser');
    },
  },
  getters: {
    getUserEmail: (state) => state.user.email,
    getUserPassword: (state) => state.user.password,
    isAuthenticated: (state) => state.isAuthenticated,
  },
});
