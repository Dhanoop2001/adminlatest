<template>
  <div class="signup-container">
    <h2 class="signup-heading">Sign Up</h2>
    <form class="signup-form" @submit.prevent="handleSignUp">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          v-model="name"
          @blur="validateName"
          required
        />
        <small v-if="errors.name" class="error-message">{{ errors.name }}</small>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          v-model="email"
          required
        />
      </div>
      <div class="form-group password-group">
        <label for="password">Password</label>
        <div class="password-container">
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            id="password"
            placeholder="Enter your password"
            v-model="password"
            @blur="validatePassword"
            required
          />
          <button
            type="button"
            class="password-toggle"
            @click="togglePasswordVisibility"
          >
            {{ isPasswordVisible ? 'Hide' : 'Show' }}
          </button>
        </div>
        <small v-if="errors.password" class="error-message">{{ errors.password }}</small>
      </div>
      <div class="form-group">
        <label for="gender">Gender</label>
        <select id="gender" v-model="gender" required>
          <option value="" disabled>Select your gender</option>
          <option value="male">Men</option>
          <option value="female">Women</option>
        </select>
      </div>
      <div class="form-group">
        <button
          type="submit"
          class="signup-button"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : 'Sign Up' }}
        </button>
      </div>
      <div class="form-group already-account">
        <span>Already have an account? <router-link to="/log-in">Login</router-link></span>
      </div>
    </form>

    <!-- Registration Success Popup -->
    <div v-if="showSuccessPopup" class="success-popup">
      <p>Registration Successful!</p>
      <button @click="closePopup">OK</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "SignUpPage",
  data() {
    return {
      isPasswordVisible: false,
      name: "",
      email: "",
      password: "",
      gender: "",
      errors: {
        name: "",
        password: "",
      },
      showSuccessPopup: false,
      isSubmitting: false,
    };
  },
  methods: {
    validateName() {
      const namePattern = /^[A-Za-z\s]+$/;
      if (!this.name) {
        this.errors.name = "Name is required.";
      } else if (!namePattern.test(this.name)) {
        this.errors.name = "Name must contain only alphabets.";
      } else {
        this.errors.name = "";
      }
    },
    validatePassword() {
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!this.password) {
        this.errors.password = "Password is required.";
      } else if (!passwordPattern.test(this.password)) {
        this.errors.password =
          "Password must contain at least 8 characters, including both letters and numbers.";
      } else {
        this.errors.password = "";
      }
    },
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    async handleSignUp() {
      this.validateName(); // Ensure name is validated
      this.validatePassword(); // Ensure password is validated

      if (!this.errors.name && !this.errors.password && this.email && this.gender) {
        this.isSubmitting = true; // Disable the button
        try {
          // Sending user data to backend API
          const response = await axios.post('http://localhost:8080/api/register', {
            name: this.name,
            email: this.email,
            password: this.password,
            gender: this.gender
          });

          if (response.status === 200) {
            this.showSuccessPopup = true;
            this.isSubmitting = false; // Re-enable the button
          }
        } catch (error) {
          console.error('Registration failed', error);
          alert("An error occurred during registration. Please try again.");
          this.isSubmitting = false; // Re-enable the button
        }
      } else {
        alert("Please fill out all fields correctly.");
      }
    },
    closePopup() {
      this.showSuccessPopup = false;
      this.$router.push("/log-in");
    },
  },
};
</script>

<style scoped>
/* Container styles */
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('@/assets/salon.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Heading styles */
.signup-heading {
  font-size: 3rem;
  color: #fff;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
  font-family: 'Arial', sans-serif;
}

/* Form styles */
.signup-form {
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 450px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: solid 1px green;
}

.signup-form:hover {
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
}

.form-group {
  margin-bottom: 1.5rem;
}

/* Label and Input styles */
label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #ddd;
  font-size: 1.1rem;
  font-family: 'Arial', sans-serif;
}

input, select {
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

input:focus, select:focus {
  background-color: #666;
  outline: none;
  border: 2px solid #66bb6a;
}

/* Password container styles */
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
  text-decoration: underline;
}

/* Button styles */
.signup-button {
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

.signup-button:hover {
  background-color: #4caf50;
  transform: translateY(-2px);
}

.signup-button:active {
  background-color: #388e3c;
  transform: translateY(1px);
}

.signup-button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

/* Already have account text styles */
.already-account {
  text-align: center;
  font-size: 1rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.already-account a {
  color: blue;
  text-decoration: none;
  font-weight: bold;
}

.already-account a:hover {
  text-decoration: underline;
}

/* Popup styles */
.success-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  z-index: 1000;
}

.success-popup p {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
}

.success-popup button {
  padding: 0.5rem 1.5rem;
  background-color: #66bb6a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.success-popup button:hover {
  background-color: #4caf50;
}

/* Error message styles */
.error-message {
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style>
