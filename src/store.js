import { createStore } from "vuex";
import axios from "axios";

// Create an Axios instance with base configuration
const apiClient = axios.create({
  baseURL:  "http://192.168.1.49:8080",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// Automatically attach token for authenticated requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const store = createStore({
  state: {
    user: { email: "" },
    isAuthenticated: false,
    token: null,
    parlours: [],
    deletionRequests: [],
  },
  mutations: {
    setUser(state, user) {
      state.user.email = user.email;
      state.token = user.token || null;
      state.isAuthenticated = !!user.token;
      if (user.token) localStorage.setItem("token", user.token);
    },
    logoutUser(state) {
      state.user = { email: "" };
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("token");
    },
    setParlours(state, parlours) {
      console.log("Setting parlours in Vuex:", parlours);
      state.parlours = parlours;
    },
    updateParlourStatus(state, { parlourId, approved }) {
      const parlour = state.parlours.find((p) => p.parlour_id === parlourId);
      if (parlour) parlour.approved = approved;
    },
    setDeletionRequests(state, requests) {
      state.deletionRequests = requests;
    },
    removeDeletionRequest(state, parlourId) {
      state.deletionRequests = state.deletionRequests.filter(
        (request) => request.parlour_id !== parlourId
      );
    },
  },
  actions: {
    async loginUser({ commit }, { email, password }) {
      try {
        console.log("Login request:", { email, password });
        const response = await apiClient.post("admin/AdminLogin", { email, password });
        console.log("Server response:", response.data);

        const token =
          typeof response.data === "string"
            ? response.data
            : response.data.token ||
              response.data.access_token ||
              response.data.accessToken ||
              response.headers["authorization"]?.replace("Bearer ", "");

        if (!token) {
          console.error("Invalid response structure:", response.data);
          throw new Error("No authentication token found");
        }

        commit("setUser", { email, token });
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return { token };
      } catch (error) {
        console.error("Login error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Login failed");
      }
    },
    logoutUser({ commit }) {
      commit("logoutUser");
      delete apiClient.defaults.headers.common["Authorization"];
    },
    async fetchParlours({ commit }) {
      try {
        const response = await apiClient.get("admin/allRegisteredParlour");
        console.log("Fetched Parlours Data:", response.data); // Check full data
        commit("setParlours", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching parlours:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch parlours");
      }
    },
    async approveParlour({ commit }, parlourId) {
      try {
        const response = await apiClient.post(`admin/approve/${parlourId}`);
        commit("updateParlourStatus", { parlourId, approved: true });
        return response.data;
      } catch (error) {
        console.error("Error approving parlour:", error);
        throw error;
      }
    },
    async rejectParlour({ commit }, parlourId) {
      try {
        const response = await apiClient.post(`admin/delete/${parlourId}`);
        commit("updateParlourStatus", { parlourId, approved: false });
        return response.data;
      } catch (error) {
        console.error("Error rejecting parlour:", error);
        throw error;
      }
    },
    async fetchDeletionRequests({ commit }) {
      try {
        const response = await apiClient.get("admin/parlour/deletion-requests");
        commit("setDeletionRequests", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching deletion requests:", error);
        throw error;
      }
    },
    async approveDeletion({ commit }, parlourId) {
      try {
        const response = await apiClient.post(`admin/approve-deletion/${parlourId}`);
        commit("removeDeletionRequest", parlourId);
        return response.data;
      } catch (error) {
        console.error("Error approving deletion request:", error);
        throw error;
      }
    },
  },
  getters: {
    getUserEmail: (state) => state.user.email,
    isAuthenticated: (state) => state.isAuthenticated,
    getAuthToken: (state) => state.token,
    getAllParlours: (state) => state.parlours,
    getDeletionRequests: (state) => state.deletionRequests,
  },
});

export default store;
