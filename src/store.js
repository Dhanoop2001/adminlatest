import { createStore } from "vuex";
import axios from "axios";

// Configure Axios with the base URL for the backend
const apiClient = axios.create({
  baseURL: "http://192.168.1.41:8080", // Replace with your Spring Boot backend's base URL
  headers: {
    "Content-Type": "application/json",
  },
});

const store = createStore({
  state: {
    user: {
      email: "",
      password: "",
    },
    isAuthenticated: false,
    token: null, // Store the authentication token
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = !!user.email;
      state.token = user.token || null; // Set token if available
    },
    logoutUser(state) {
      state.user = { email: "", password: "" };
      state.isAuthenticated = false;
      state.token = null; // Clear token on logout
    },
  },
  actions: {
    async loginUser({ commit }, user) {
      try {
        const response = await apiClient.post("/admin/login", user);
        // Assuming the backend returns the user object with a token
        const userData = response.data;
        commit("setUser", userData);
        return userData;
      } catch (error) {
        console.error("Error during login:", error);
        throw error;
      }
    },
    logoutUser({ commit }) {
      commit("logoutUser");
    },
  },
  getters: {
    getUserEmail: (state) => state.user.email,
    getUserPassword: (state) => state.user.password,
    isAuthenticated: (state) => state.isAuthenticated,
    getAuthToken: (state) => state.token,
  },
});

export default store;
