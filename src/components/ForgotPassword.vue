<template>
    <div class="forgot-password-container">
      <div class="login-backdrop">
        <div class="animated-shapes">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
          <div class="circle circle-4"></div>
        </div>
        
        <div class="reset-card">
          <div class="brand-section">
            <div class="brand-logo">
              <span class="logo-icon"><i class="fas fa-spa"></i></span>
            </div>
            <h1 class="brand-name">SalonInfo <br> <span>Password Reset</span></h1>
          </div>
          
          <div class="reset-form-section">
            <div class="reset-header">
              <h2>Forgot Password</h2>
              <p>Enter your email to receive a password reset link</p>
            </div>
            
            <div class="form-group">
              <label for="email">Email Address</label>
              <div class="input-wrapper">
                <span class="input-icon"><i class="fas fa-envelope"></i></span>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  placeholder="Your email address"
                  @keyup.enter="sendResetLink"
                />
              </div>
              <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </div>
            
            <button 
              class="reset-button" 
              @click="sendResetLink" 
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Send Reset Link</span>
              <div v-else class="button-loader">
                <div class="spinner"></div>
              </div>
            </button>
            
            <div v-if="successMessage" class="success-alert">
              <i class="fas fa-check-circle"></i>
              <span>{{ successMessage }}</span>
            </div>
  
            <!-- Link to Login Page -->
            <div class="login-link">
              <p>Remember your password? <router-link to="/log-in" class="login-text">Login</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ForgotPassword',
    data() {
      return {
        email: '',
        isLoading: false,
        errorMessage: '',
        successMessage: ''
      };
    },
    methods: {
      validateEmail() {
        this.errorMessage = '';
        
        if (!this.email) {
          this.errorMessage = 'Email address is required';
          return false;
        } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
          this.errorMessage = 'Please enter a valid email address';
          return false;
        }
        
        return true;
      },
      async sendResetLink() {
        if (!this.validateEmail()) return;
  
        this.errorMessage = '';
        this.successMessage = '';
        this.isLoading = true;
  
        try {
          const response = await axios.post('http://192.168.1.7:8086/api/otp/forgot-password', {
            email: this.email
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          this.successMessage = response.data.message || 'Reset link sent to your email. Please check your inbox.';
          this.email = ''; // Clear the email field after success
          
        } catch (error) {
          console.error('Password reset error:', error);
          if (error.response && error.response.data) {
            this.errorMessage = error.response.data.message || 'Failed to send reset link. Please try again.';
          } else {
            this.errorMessage = 'Network error. Please try again later.';
          }
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  .forgot-password-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Montserrat', sans-serif;
    background-color: #0a2463;
    overflow: hidden;
  }
  
  .login-backdrop {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .animated-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.03);
    animation: float 15s infinite ease-in-out;
  }
  
  .circle-1 {
    width: 300px;
    height: 300px;
    top: -50px;
    left: -100px;
    background: linear-gradient(145deg, rgba(65, 88, 208, 0.2) 0%, rgba(64, 112, 208, 0.08) 100%);
    animation-delay: 0s;
  }
  
  .circle-2 {
    width: 400px;
    height: 400px;
    bottom: -150px;
    right: -100px;
    background: linear-gradient(145deg, rgba(25, 175, 208, 0.15) 0%, rgba(25, 145, 208, 0.05) 100%);
    animation-delay: -5s;
  }
  
  .circle-3 {
    width: 200px;
    height: 200px;
    top: 30%;
    right: 15%;
    background: linear-gradient(145deg, rgba(80, 120, 208, 0.12) 0%, rgba(60, 90, 208, 0.04) 100%);
    animation-delay: -10s;
  }
  
  .circle-4 {
    width: 150px;
    height: 150px;
    bottom: 25%;
    left: 10%;
    background: linear-gradient(145deg, rgba(120, 150, 208, 0.12) 0%, rgba(100, 130, 208, 0.05) 100%);
    animation-delay: -15s;
  }
  
  @keyframes float {
    0% {
      transform: translateY(0) rotate(0);
    }
    50% {
      transform: translateY(-30px) rotate(5deg);
    }
    100% {
      transform: translateY(0) rotate(0);
    }
  }
  
  .reset-card {
    width: 900px;
    max-width: 90%;
    display: flex;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    position: relative;
    z-index: 2;
  }
  
  .brand-section {
    width: 40%;
    background: linear-gradient(135deg, #1e50e2 0%, #0a2463 100%);
    padding: 50px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
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
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
      radial-gradient(circle at 75% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 20%);
    opacity: 0.6;
  }
  
  .brand-logo {
    background: rgba(255, 255, 255, 0.15);
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-bottom: 25px;
    backdrop-filter: blur(5px);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  }
  
  .logo-icon {
    font-size: 36px;
    color: white;
  }
  
  .brand-name {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 10px;
    text-align: center;
  }
  
  .brand-name span {
    font-weight: 300;
  }
  
  .reset-form-section {
    width: 60%;
    padding: 50px 60px;
    background: white;
  }
  
  .reset-header {
    margin-bottom: 40px;
    text-align: center;
  }
  
  .reset-header h2 {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }
  
  .reset-header p {
    color: #777;
    font-size: 15px;
  }
  
  .form-group {
    margin-bottom: 25px;
  }
  
  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #555;
    margin-bottom: 10px;
  }
  
  .input-wrapper {
    position: relative;
    width: 100%;
  }
  
  .input-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    font-size: 16px;
  }
  
  .input-wrapper input {
    width: 100%;
    padding: 15px 15px 15px 45px;
    border: 1px solid #e0e6ed;
    border-radius: 12px;
    font-size: 15px;
    color: #333;
    background: #f9fafc;
    transition: all 0.3s;
  }
  
  .input-wrapper input:focus {
    outline: none;
    border-color: #1e50e2;
    box-shadow: 0 0 0 4px rgba(30, 80, 226, 0.1);
    background: #fff;
  }
  
  .reset-button {
    width: 100%;
    padding: 15px;
    background: linear-gradient(to right, #1e50e2, #0a2463);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 6px rgba(30, 80, 226, 0.2);
    position: relative;
    overflow: hidden;
  }
  
  .reset-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  .reset-button:hover::before {
    left: 100%;
  }
  
  .reset-button:hover {
    background: linear-gradient(to right, #1745c5, #081d54);
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(30, 80, 226, 0.25);
  }
  
  .reset-button:disabled {
    background: #ccc;
    box-shadow: none;
    cursor: not-allowed;
  }
  
  .button-loader {
    display: flex;
    justify-content: center;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.5);
    border-top: 3px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .error-message {
    color: #e74c3c;
    font-size: 12px;
    margin-top: 5px;
  }
  
  .success-alert {
    display: flex;
    align-items: center;
    background: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
  }
  
  .success-alert i {
    margin-right: 10px;
    font-size: 18px;
  }
  
  .login-link {
    text-align: center;
    margin-top: 20px;
  }
  
  .login-text {
    color: #1e50e2;
    text-decoration: none;
    transition: color 0.2s;
    font-weight: 500;
  }
  
  .login-text:hover {
    text-decoration: underline;
  }
  
  /* Make it responsive */
  @media (max-width: 768px) {
    .reset-card {
      flex-direction: column;
      width: 90%;
    }
    
    .brand-section {
      width: 100%;
      padding: 30px;
    }
    
    .reset-form-section {
      width: 100%;
      padding: 30px;
    }
  }
  </style>