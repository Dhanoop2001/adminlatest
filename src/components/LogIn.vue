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
            <i :class="isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="form-group">
        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? 'LOGIN' : 'LOGIN' }}
        </button>
      </div>
      <div class="form-group forgot-password">
        <span>
          <a href="#" @click.prevent="openForgotPasswordModal">Forgot Password?</a>
        </span>
      </div>
    </form>

    <div v-if="isModalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>Reset Your Password</h3>
        <p>Please enter your email address to receive password reset instructions.</p>
        <input 
          type="email" 
          v-model="resetEmail" 
          placeholder="Enter your email" 
          required 
          :disabled="isResetting"
        />
        <div v-if="resetError" class="error-message">
          {{ resetError }}
        </div>
        <div class="modal-actions">
          <button 
            @click="handlePasswordReset" 
            class="reset-button"
            :disabled="isResetting"
          >
            {{ isResetting ? 'Sending...' : 'Send Reset Link' }}
          </button>
          <button 
            @click="closeModal" 
            class="close-button"
            :disabled="isResetting"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  name: "AdminLogin",
  data() {
    return {
      isPasswordVisible: false,
      email: "",
      password: "",
      isModalVisible: false,
      resetEmail: "",
      error: null,
      resetError: null,
      isLoading: false,
      isResetting: false
    };
  },
  methods: {
    ...mapActions(['loginUser']),
    
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    
    async handleLogin() {
      if (!this.email || !this.password) {
        this.error = "Please enter both email and password.";
        return;
      }

      this.error = null;
      this.isLoading = true;

      try {
        await this.loginUser({        // If login successful, redirect to admin panel

          email: this.email,
          password: this.password
        });
        
        this.$router.push("/admin-panel");
      } catch (error) {
        console.error("Login error:", error);
        if (error.response?.status === 401) {
          this.error = "Invalid email or password.";
        } else if (error.response?.status === 429) {
          this.error = "Too many login attempts. Please try again later.";
        } else {
          this.error = "An error occurred during login. Please try again.";
        }
      } finally {
        this.isLoading = false;
      }
    },
    
    openForgotPasswordModal() {
      this.isModalVisible = true;
      this.resetError = null;
      this.resetEmail = this.email; // Pre-fill with email if available
    },
    
    closeModal() {
      if (this.isResetting) return;
      this.isModalVisible = false;
      this.resetEmail = "";
      this.resetError = null;
    },
    
    async handlePasswordReset() {
      if (!this.resetEmail) {
        this.resetError = "Please enter a valid email address.";
        return;
      }

      this.resetError = null;
      this.isResetting = true;

      try {
        // Replace with your actual API endpoint
        await axios.post('/admin/reset-password', {
          email: this.resetEmail
        });
        
        alert(`Password reset email has been sent to ${this.resetEmail}`);
        this.closeModal();
      } catch (error) {
        console.error("Password reset error:", error);
        if (error.response?.status === 404) {
          this.resetError = "Email address not found.";
        } else if (error.response?.status === 429) {
          this.resetError = "Too many reset attempts. Please try again later.";
        } else {
          this.resetError = "Failed to send reset email. Please try again.";
        }
      } finally {
        this.isResetting = false;
      }
    }
  }
};
</script>

<style scoped>
/* Existing styles remain unchanged */
.error-message {
  color: #ff4444;
  background-color: rgba(255, 68, 68, 0.1);
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}

/* General Styles */
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

/* Form */
.login-form {
  border: 1px solid gold;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 450px;
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
}

input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Password Field */
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
  font-size: 1.5rem;
  cursor: pointer;
}

/* Buttons */
.login-button {
  width: 100%;
  padding: 1rem;
  background-color: black;
  color: #fff;
  border: 2px solid gold;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-button:not(:disabled):hover {
  background-color: gold;
  color: black;
}

.forgot-password {
  text-align: center;
  font-size: 1rem;
  color: white;
}

.forgot-password a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: opacity 0.3s ease;
}

.forgot-password a:hover {
  text-decoration: underline;
  opacity: 0.8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  border: 2px solid gold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content h3 {
  color: black;
  margin-bottom: 1rem;
}

.modal-content p {
  color: #666;
  margin-bottom: 1.5rem;
}

.modal-content input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  background-color: white;
  color: black;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.reset-button,
.close-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-button:disabled,
.close-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.reset-button {
  background-color: gold;
  color: black;
  font-weight: bold;
  border: none;
}

.reset-button:not(:disabled):hover {
  background-color: #ffd700;
  transform: translateY(-1px);
}

.close-button {
  background-color: black;
  color: white;
  border: 1px solid black;
}

.close-button:not(:disabled):hover {
  background-color: #333;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>