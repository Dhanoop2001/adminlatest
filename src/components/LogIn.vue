<template>
  <div class="login-container">
    <h2 class="login-heading">Log In</h2>
    <form class="login-form" @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div class="form-group password-group">
        <label for="password">Password</label>
        <div class="password-container">
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            class="password-toggle"
            @click="togglePasswordVisibility"
            :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
          >
            {{ isPasswordVisible ? 'Hide' : 'Show' }}
          </button>
        </div>
      </div>
      <div class="form-group">
        <button type="submit" class="login-button">Log In</button>
      </div>
      <div class="form-group already-account">
        <span>
          Do you have an account? 
          <router-link to="/sign-up">Sign Up</router-link>
        </span>
      </div>
    </form>
  </div>
</template>

<script>
// import axios from 'axios'; // Uncomment this if using the backend

export default {
  name: "AdminLogIn",
  data() {
    return {
      isPasswordVisible: false,
      email: "",
      password: "",
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    async handleLogin() {
      try {
        /* 
        // Uncomment this block when backend is available
        const response = await axios.post('http://localhost:5000/api/login', {
          email: this.email,
          password: this.password,
        });

        const { token } = response.data;
        localStorage.setItem('token', token); // Store JWT token
        */

        // Simulated success
        console.log("Simulating successful login.");
        localStorage.setItem('token', 'fake-token'); // Simulated token storage

        this.$router.push('/admin-panel'); // Redirect to admin panel
      } catch (error) {
        alert("An error occurred during login. Please try again."); // Simulated error
        // alert(error.response.data.message); // Use this with backend
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url("@/assets/goldbg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-heading {
  font-size: 3rem;
  color: #fff;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
  font-family: "Arial", sans-serif;
}

.login-form {
  border: 1px solid gold;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 450px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-form:hover {
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #ddd;
  font-size: 1.1rem;
  font-family: "Arial", sans-serif;
}

input {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  background-color: black;
  color: #fff;
  box-sizing: border-box;
  transition: background-color 0.3s ease, border 0.3s ease;
}

input:focus {
  background-color: black;
  outline: none;
  border: 2px solid gold;
  border-radius: 30px;
}

input:valid {
  background-color: black;
  color: white;
}


.password-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: gold;
  font-size: 0.8rem;
  cursor: pointer;
}

.login-button {
  width: 100%;
  padding: 1rem;
  background-color: black;
  color: #fff;
  border: none;
  border: 2px solid gold;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease-in-out;
}

.login-button:hover {
  background-color: black;
  transform: translateY(-2px);
}

.login-button:active {
  background-color: black;
  transform: translateY(1px);
  border: 1px solid gold;
}

.already-account {
  text-align: center;
  font-size: 1rem;
  color: white;
}

.already-account a {
  color: blue;
  text-decoration: none;
  font-weight: bold;
}

.already-account a:hover {
  text-decoration: underline;
}
</style>
