<template>
  <div class="signup-container">
    <div class="form-section">
      <h1 class="heading">SIGN IN</h1>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <v-text-field
            label="Email address"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
            outlined
            dense
          ></v-text-field>
        </div>

        <div class="form-group">
          <v-text-field
            label="Password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            required
            outlined
            dense
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>
        </div>

        <v-btn type="submit" block class="signup-button">Sign in</v-btn>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </form>
    </div>

    <div class="image-section">
      <!-- Monstera leaf image background will be set with CSS -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      showPassword: false,
      errorMessage: ''
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMessage = ''; // Reset error message
      try {
        const response = await axios.post('http://192.168.1.200:8086/api/admin/AdminLogin', {
          email: this.form.email,
          password: this.form.password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Full API Response:', response); // Debugging log

        if (response.status === 200) {
          this.storeToken(response.data?.token); // Store the token
          console.log('Login successful, navigating to admin panel...');
          this.$router.push('/admin-panel'); // Redirect to admin panel
        } else {
          this.errorMessage = 'Unexpected response. Please try again.';
        }
      } catch (error) {
        console.error('Login failed:', error);

        if (error.response) {
          this.errorMessage = error.response.data?.message || 'Login failed. Please check your credentials.';
        } else if (error.request) {
          this.errorMessage = 'No response from server. Please try again later.';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    },
    storeToken(token) {
      if (token) {
        localStorage.setItem('authToken', token); // Store the token in local storage
      }
    }
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
}

.form-section {
  flex: 1;
  padding: 2rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.signup-button {
  width: 100%;
  padding: 0.75rem;
  background-color: skyblue;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.signup-button:hover {
  background-color: black;
}

.image-section {
  flex: 1;
  background-image: url('@/assets/hair.jpg'); /* Update with your image path */
  background-size: cover;
  background-position: center;
}

.heading {
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1.5rem;
}

.error-message {
  color: red;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .signup-container {
    flex-direction: column;
  }
  
  .image-section {
    display: none;
  }
  
  .form-section {
    padding: 2rem;
  }
}
</style>