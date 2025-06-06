<template>
  <div class="admin-login-container">
    <div class="login-backdrop">
      <div class="floating-elements">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>
      
      <div class="login-card">
        <div class="brand-section">
          <div class="brand-decoration">
            <div class="decoration-circle circle-1"></div>
            <div class="decoration-circle circle-2"></div>
            <div class="decoration-circle circle-3"></div>
          </div>
          
          <div class="brand-logo">
            <span class="logo-icon"><i class="fas fa-spa"></i></span>
          </div>
          <h1 class="brand-name">SalonInfo</h1>
          <div class="brand-divider"></div>
          <p class="brand-tagline">Elevating Beauty Management</p>
        </div>
        
        <div class="login-form-section">
          <div class="login-header">
            <h2>Change Password</h2>
            <p>Enter your new password below</p>
          </div>
          
          <form @submit.prevent="changePassword" class="login-form">
            <div class="form-group">
              <label for="current-password">Current Password</label>
              <div class="input-wrapper">
                <span class="input-icon"><i class="fas fa-lock"></i></span>
                <input
                  :type="showCurrentPassword ? 'text' : 'password'"
                  id="current-password"
                  v-model="currentPassword"
                  placeholder="Enter your current password"
                  @keyup.enter="changePassword"
                  :class="{ 'error': errors.currentPassword }"
                />
                <button 
                  type="button" 
                  class="visibility-toggle" 
                  @click="toggleCurrentPasswordVisibility"
                >
                  <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <transition name="error-fade">
                <p v-if="errors.currentPassword" class="error-message">{{ errors.currentPassword }}</p>
              </transition>
            </div>
            
            <div class="form-group">
              <label for="new-password">New Password</label>
              <div class="input-wrapper">
                <span class="input-icon"><i class="fas fa-lock"></i></span>
                <input
                  :type="showNewPassword ? 'text' : 'password'"
                  id="new-password"
                  v-model="newPassword"
                  placeholder="Enter your new password"
                  @keyup.enter="changePassword"
                  :class="{ 'error': errors.newPassword }"
                />
                <button 
                  type="button" 
                  class="visibility-toggle" 
                  @click="toggleNewPasswordVisibility"
                >
                  <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <transition name="error-fade">
                <p v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</p>
              </transition>
            </div>
            
            <div class="form-group">
              <label for="confirm-password">Confirm New Password</label>
              <div class="input-wrapper">
                <span class="input-icon"><i class="fas fa-lock"></i></span>
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirm-password"
                  v-model="confirmPassword"
                  placeholder="Confirm your new password"
                  @keyup.enter="changePassword"
                  :class="{ 'error': errors.confirmPassword }"
                />
                <button 
                  type="button" 
                  class="visibility-toggle" 
                  @click="toggleConfirmPasswordVisibility"
                >
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <transition name="error-fade">
                <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
              </transition>
            </div>
            
            <button 
              type="submit"
              class="login-button" 
              :disabled="isLoading"
            >
              <span v-if="!isLoading" class="button-content">
                <i class="fas fa-key"></i>
                Change Password
              </span>
              <div v-else class="button-loader">
                <div class="spinner"></div>
                <span>Processing...</span>
              </div>
            </button>
            
            <transition name="error-slide">
              <div v-if="errorMessage" class="error-alert">
                <i class="fas fa-exclamation-triangle"></i>
                <span>{{ errorMessage }}</span>
              </div>
            </transition>
            
            <transition name="error-slide">
              <div v-if="successMessage" class="success-alert">
                <i class="fas fa-check-circle"></i>
                <span>{{ successMessage }}</span>
              </div>
            </transition>

            <div class="additional-links">
              <router-link to="/" class="change-password-link">
                <i class="fas fa-sign-in-alt"></i>
                Back to Sign In
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChangePassword',
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      errors: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    validateForm() {
      this.errors = { currentPassword: '', newPassword: '', confirmPassword: '' };
      this.errorMessage = '';
      let isValid = true;

      // Current Password validation
      if (!this.currentPassword) {
        this.errors.currentPassword = 'Current password is required';
        isValid = false;
      }

      // New Password validation
      if (!this.newPassword) {
        this.errors.newPassword = 'New password is required';
        isValid = false;
      } else if (this.newPassword.length < 8) {
        this.errors.newPassword = 'New password must be at least 8 characters long';
        isValid = false;
      }

      // Confirm Password validation
      if (!this.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your new password';
        isValid = false;
      } else if (this.newPassword !== this.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }

      return isValid;
    },
    toggleCurrentPasswordVisibility() {
      this.showCurrentPassword = !this.showCurrentPassword;
    },
    toggleNewPasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async changePassword() {
      if (!this.validateForm()) return;

      this.errorMessage = '';
      this.successMessage = '';
      this.isLoading = true;

      try {
        const response = await axios.post('http://192.168.1.7:8086/api/admin/change-password', {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        this.successMessage = response.data.message || 'Password changed successfully.';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      } catch (error) {
        console.error('Password change error:', error);
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || 'Failed to change password. Please try again.';
        } else {
          this.errorMessage = 'Network error. Please try again later.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

:root {
  --primary-brown: #936F5A;
  --secondary-brown: #914934;
  --cream: #EADFD5;
  --dark-brown: #6B4C3A;
  --light-brown: #B8967E;
  --text-dark: #2C1810;
  --text-medium: #5D4037;
  --text-light: #8D6E63;
  --white: #FFFFFF;
  --error: #D32F2F;
  --success: #2E7D32;
  --shadow-light: rgba(44, 24, 16, 0.08);
  --shadow-medium: rgba(44, 24, 16, 0.15);
  --shadow-heavy: rgba(44, 24, 16, 0.25);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, var(--cream) 0%, #F5F0EA 50%, var(--cream) 100%);
  overflow: hidden;
  position: relative;
}

.login-backdrop {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(147, 111, 90, 0.12), rgba(145, 73, 52, 0.06));
  animation: float 25s infinite ease-in-out;
  backdrop-filter: blur(1px);
}

.shape-1 {
  width: 400px;
  height: 400px;
  top: -150px;
  left: -200px;
  animation-delay: 0s;
}

.shape-2 {
  width: 350px;
  height: 350px;
  bottom: -120px;
  right: -180px;
  animation-delay: -8s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  top: 15%;
  right: 8%;
  animation-delay: -16s;
}

.shape-4 {
  width: 180px;
  height: 180px;
  bottom: 30%;
  left: 5%;
  animation-delay: -24s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0) rotate(0deg) scale(1); 
    opacity: 0.6;
  }
  25% { 
    transform: translateY(-30px) rotate(2deg) scale(1.05); 
    opacity: 0.8;
  }
  50% { 
    transform: translateY(-50px) rotate(-1deg) scale(0.95); 
    opacity: 0.4;
  }
  75% { 
    transform: translateY(-20px) rotate(1deg) scale(1.02); 
    opacity: 0.7;
  }
}

.login-card {
  width: 1100px;
  max-width: 95%;
  display: flex;
  background: var(--white);
  border-radius: 28px;
  box-shadow: 
    0 50px 100px -20px var(--shadow-heavy),
    0 20px 40px -10px var(--shadow-medium),
    0 0 0 1px rgba(147, 111, 90, 0.08);
  overflow: hidden;
  position: relative;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.brand-section {
  width: 45%;
  background: linear-gradient(135deg, var(--primary-brown) 0%, var(--secondary-brown) 100%);
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--white);
  position: relative;
  overflow: hidden;
}

.brand-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 25%);
  opacity: 0.8;
}

.brand-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  animation: decorationFloat 30s infinite ease-in-out;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  right: -50px;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -30px;
  left: -40px;
  animation-delay: -10s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: -20px;
  animation-delay: -20s;
}

@keyframes decorationFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
}

.brand-logo {
  background: rgba(255, 255, 255, 0.2);
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.brand-logo:hover {
  transform: translateY(-5px) scale(1.05);
}

.logo-icon {
  font-size: 42px;
  color: var(--white);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -1px;
  margin-bottom: 8px;
  text-align: center;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.brand-divider {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;
  border-radius: 1px;
  position: relative;
  z-index: 2;
}

.brand-tagline {
  font-size: 16px;
  font-weight: 400;
  opacity: 0.8;
  text-align: center;
  font-style: italic;
  position: relative;
  z-index: 2;
}

.login-form-section {
  width: 55%;
  padding: 60px 70px;
  background: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-header {
  margin-bottom: 50px;
  text-align: center;
}

.login-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.login-header p {
  color: var(--text-light);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 32px;
}

.form-group label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-medium);
  margin-bottom: 12px;
  letter-spacing: 0.3px;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  font-size: 16px;
  z-index: 2;
  transition: color 0.3s ease;
}

.input-wrapper input {
  width: 100%;
  padding: 18px 20px 18px 55px;
  border: 2px solid #E8DDD4;
  border-radius: 16px;
  font-size: 16px;
  color: var(--text-dark);
  background: #FEFDFB;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--primary-brown);
  background: var(--white);
  box-shadow: 
    0 0 0 4px rgba(147, 111, 90, 0.1),
    0 8px 16px rgba(147, 111, 90, 0.08);
  transform: translateY(-2px);
}

.input-wrapper input:focus + .input-icon,
.input-wrapper input:focus ~ .input-icon {
  color: var(--primary-brown);
}

.input-wrapper input.error {
  border-color: var(--error);
  background: rgba(211, 47, 47, 0.02);
}

.visibility-toggle {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  z-index: 2;
}

.visibility-toggle:hover {
  color: var(--primary-brown);
  background: rgba(147, 111, 90, 0.1);
}

.login-button {
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, var(--primary-brown) 0%, var(--secondary-brown) 100%);
  color: var(--white);
  border: none;
  border-radius: 16px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 16px rgba(147, 111, 90, 0.3),
    0 4px 8px rgba(147, 111, 90, 0.2);
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.5px;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover {
  background: linear-gradient(135deg, var(--dark-brown) 0%, var(--secondary-brown) 100%);
  transform: translateY(-3px);
  box-shadow: 
    0 12px 24px rgba(147, 111, 90, 0.4),
    0 6px 12px rgba(147, 111, 90, 0.3);
}

.login-button:active {
  transform: translateY(-1px);
}

.login-button:disabled {
  background: var(--light-brown);
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.button-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid var(--white);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: var(--error);
  font-size: 13px;
  font-weight: 500;
  margin-top: 8px;
  padding-left: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.error-message::before {
  content: '⚠';
  font-size: 12px;
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(211, 47, 47, 0.08);
  color: var(--error);
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid var(--error);
  font-weight: 500;
}

.success-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(46, 125, 50, 0.08);
  color: var(--success);
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid var(--success);
  font-weight: 500;
}

.additional-links {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.change-password-link {
  color: var(--primary-brown);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 15px;
}

.change-password-link:hover {
  background: rgba(147, 111, 90, 0.1);
  color: var(--secondary-brown);
  transform: translateY(-1px);
}

/* Animations */
.error-fade-enter-active, .error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from, .error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.error-slide-enter-active, .error-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.error-slide-enter-from, .error-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-card {
    width: 90%;
    flex-direction: column;
  }
  
  .brand-section {
    width: 100%;
    padding: 40px 30px;
  }
  
  .login-form-section {
    width: 100%;
    padding: 40px 30px;
  }
  
  .brand-name {
    font-size: 36px;
  }
  
  .login-header h2 {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .admin-login-container {
    padding: 20px;
  }
  
  .login-card {
    width: 100%;
    border-radius: 20px;
  }
  
  .brand-section, .login-form-section {
    padding: 30px 20px;
  }
  
  .brand-name {
    font-size: 32px;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
  
  .form-group {
    margin-bottom: 24px;
  }
  
  .input-wrapper input {
    padding: 16px 18px 16px 50px;
    font-size: 15px;
  }
  
  .login-button {
    padding: 18px;
    font-size: 16px;
  }
}
</style>