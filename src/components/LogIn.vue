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
import axios from 'axios';

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
        const response = await axios.post('http://localhost:5000/api/login', {
          email: this.email,
          password: this.password,
        });

        const { token } = response.data;
        localStorage.setItem('token', token); // Store JWT token

        this.$router.push('/adminpanel'); // Redirect to admin panel
      } catch (error) {
        alert(error.response.data.message); // Show error message
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
  background-image: url("@/assets/salon.jpg");
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
  border: 1px solid green;
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
  border-radius: 8px;
  font-size: 1rem;
  background-color: #555;
  color: #fff;
  box-sizing: border-box;
  transition: background-color 0.3s ease, border 0.3s ease;
}

input:focus {
  background-color: #666;
  outline: none;
  border: 2px solid #66bb6a;
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
  color: rgb(24, 204, 24);
  font-size: 0.8rem;
  cursor: pointer;
}

.login-button {
  width: 100%;
  padding: 1rem;
  background-color: #66bb6a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease-in-out;
}

.login-button:hover {
  background-color: #4caf50;
  transform: translateY(-2px);
}

.login-button:active {
  background-color: #388e3c;
  transform: translateY(1px);
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
