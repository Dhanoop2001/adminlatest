// import { createStore } from "vuex";
// import axios from "axios";

// // Create an Axios instance with base configuration
// const apiClient = axios.create({
//   baseURL: "http://192.168.1.150:8080",
//   headers: {
//     "Accept": "application/json",
//     "Content-Type": "application/json",
//   },
// });

// // Attach token from localStorage on app load
// const savedToken = localStorage.getItem("token");
// if (savedToken) {
//   apiClient.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
// }

// const store = createStore({
//   state: {
//     user: { email: "" },
//     isAuthenticated: !!savedToken, // Ensure persistence
//     token: savedToken || null,
//     parlours: [],
//   },
//   mutations: {
//     setUser(state, user) {
//       state.user.email = user.email;
//       state.token = user.token || null;
//       state.isAuthenticated = !!user.token;

//       if (user.token) {
//         localStorage.setItem("token", user.token);
//         apiClient.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
//       }
//     },
//     logoutUser(state) {
//       state.user = { email: "" };
//       state.isAuthenticated = false;
//       state.token = null;
//       localStorage.removeItem("token");
//       delete apiClient.defaults.headers.common["Authorization"];
//     },
//     setParlours(state, parlours) {
//       state.parlours = parlours;
//     },
//   },
//   actions: {
//     async loginUser({ commit }, { email, password }) {
//       try {
//         console.log("Login request:", { email, password });

//         const response = await apiClient.post("/api/admin/AdminLogin", { email, password });

//         console.log("Complete server response:", {
//           status: response.status,
//           headers: response.headers,
//           data: response.data
//         });

//         // Handle token extraction from response
//         const token = typeof response.data === "string" 
//           ? response.data 
//           : response.data.token || 
//             response.data.access_token || 
//             response.data.accessToken || 
//             response.headers["authorization"]?.replace("Bearer ", "");

//         if (!token) {
//           console.error("Response structure:", response.data);
//           throw new Error("No authentication token found in server response");
//         }

//         commit("setUser", { email, token });

//         return { token };
//       } catch (error) {
//         if (error.response) {
//           console.error("Server error details:", {
//             status: error.response.status,
//             statusText: error.response.statusText,
//             data: error.response.data,
//             headers: error.response.headers,
//           });

//           const errorMessage = error.response.data.message || 
//                                error.response.data.error || 
//                                error.response.statusText || 
//                                "Server error occurred";
//           throw new Error(errorMessage);
//         } else if (error.request) {
//           console.error("No response received:", error.request);
//           throw new Error("No response received from server");
//         } else {
//           console.error("Login error:", error.message);
//           throw error;
//         }
//       }
//     },
//     logoutUser({ commit }) {
//       commit("logoutUser");
//     },
//     async fetchParlours({ commit }) {
//       try {
//         const response = await apiClient.get("/admin/allRegisteredParlour");
//         console.log("Fetched parlours:", response.data);
//         commit("setParlours", response.data);
//         return response.data;
//       } catch (error) {
//         console.error("Error fetching parlours:", error);
//         if (error.response) {
//           throw new Error(error.response.data.message || "Failed to fetch parlours");
//         } else if (error.request) {
//           throw new Error("No response received from server");
//         } else {
//           throw error;
//         }
//       }
//     },
//   },
//   getters: {
//     getUserEmail: (state) => state.user.email,
//     isAuthenticated: (state) => state.isAuthenticated,
//     getAuthToken: (state) => state.token,
//     getAllParlours: (state) => state.parlours,
//   },
// });

// export default store;
