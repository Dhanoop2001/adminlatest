<template>
    <div class="admin-signup-container">
      <div class="signup-backdrop">
        <div class="animated-shapes">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
          <div class="circle circle-4"></div>
        </div>
        
        <div class="signup-card">
          <div class="brand-section">
            <div class="brand-logo">
              <span class="logo-icon"><i class="fas fa-spa"></i></span>
            </div>
            <h1 class="brand-name">SalonInfo <br> <span>AdminSignup</span></h1>
          </div>
          
          <div class="signup-form-section">
            <div class="signup-header">
              <h2>Create Admin Account</h2>
              <p>Fill in your details to create a new account</p>
            </div>
            
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <div class="input-wrapper">
                <span class="input-icon"><i class="fas fa-user"></i></span>
                <input 
                  type="text" 
                  id="fullName" 
                  v-model="fullName" 
                  placeholder="Your full name"
                />
              </div>
              <p v-if="errors.fullName" class="error-message">{{ errors.fullName }}</p>
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
                />
              </div>
              <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
            </div>
            
            <div class="form-row">
              <div class="form-group half-width">
                <label for="password">Password</label>
                <div class="input-wrapper">
                  <span class="input-icon"><i class="fas fa-lock"></i></span>
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    id="password" 
                    v-model="password" 
                    placeholder="Create password"
                  />
                  <button 
                    type="button" 
                    class="visibility-toggle" 
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
              </div>
              
              <div class="form-group half-width">
                <label for="confirmPassword">Confirm Password</label>
                <div class="input-wrapper">
                  <span class="input-icon"><i class="fas fa-lock"></i></span>
                  <input 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    id="confirmPassword" 
                    v-model="confirmPassword" 
                    placeholder="Confirm password"
                  />
                  <button 
                    type="button" 
                    class="visibility-toggle" 
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
              </div>
            </div>
            
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <div class="input-wrapper">
                <span class="input-icon"><i class="fas fa-phone"></i></span>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="phone" 
                  placeholder="Your phone number"
                />
              </div>
              <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
            </div>
            
            <button 
              class="signup-button" 
              @click="signup" 
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Create Account</span>
              <div v-else class="button-loader">
                <div class="spinner"></div>
              </div>
            </button>
            
            <div v-if="signupError" class="error-alert">
              <i class="fas fa-exclamation-triangle"></i>
              <span>{{ signupError }}</span>
            </div>
            
            <div class="login-link">
              Already have an account? <a @click="goToLogin" class="link">Sign In</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AdminSignup',
    data() {
      return {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        showPassword: false,
        showConfirmPassword: false,
        isLoading: false,
        signupError: '',
        errors: {
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: ''
        }
      }
    },
    methods: {
      validateForm() {
        this.errors = {
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: ''
        };
        
        let isValid = true;
        
        if (!this.fullName) {
          this.errors.fullName = 'Full name is required';
          isValid = false;
        }
        
        if (!this.email) {
          this.errors.email = 'Email address is required';
          isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
          this.errors.email = 'Please enter a valid email address';
          isValid = false;
        }
        
        if (!this.password) {
          this.errors.password = 'Password is required';
          isValid = false;
        } else if (this.password.length < 8) {
          this.errors.password = 'Password must be at least 8 characters';
          isValid = false;
        }
        
        if (!this.confirmPassword) {
          this.errors.confirmPassword = 'Please confirm your password';
          isValid = false;
        } else if (this.confirmPassword !== this.password) {
          this.errors.confirmPassword = 'Passwords do not match';
          isValid = false;
        }
        
        if (!this.phone) {
          this.errors.phone = 'Phone number is required';
          isValid = false;
        } else if (!/^\d{10}$/.test(this.phone.replace(/\D/g, ''))) {
          this.errors.phone = 'Please enter a valid phone number';
          isValid = false;
        }
        
        return isValid;
      },
      async signup() {
        if (!this.validateForm()) return;
  
        this.isLoading = true;
        this.signupError = '';
  
        try {
           await axios.post('http://192.168.1.2:8086/api/admin/AdminSignup', {
            fullName: this.fullName,
            email: this.email,
            password: this.password,
            phone: this.phone
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          // Redirect to login page with success message
          this.$router.push({
            path: '/admin-login',
            query: { registered: 'success' }
          });
  
        } catch (error) {
          console.error('Signup error:', error);
          if (error.response && error.response.data) {
            this.signupError = error.response.data.message || 'Registration failed. Please try again.';
          } else {
            this.signupError = 'Network error. Please try again later.';
          }
        } finally {
          this.isLoading = false;
        }
      },
      goToLogin() {
        this.$router.push('/log-in');
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
  
  .admin-signup-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Montserrat', sans-serif;
    background-color: #0a2463;
    overflow: hidden;
  }
  
  .signup-backdrop {
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
  
  .signup-card {
    width: 1000px;
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
  
  .signup-form-section {
    width: 60%;
    padding: 40px 50px;
    background: white;
    max-height: 100vh;
    overflow-y: auto;
  }
  
  .signup-header {
    margin-bottom: 30px;
    text-align: center;
  }
  
  .signup-header h2 {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }
  
  .signup-header p {
    color: #777;
    font-size: 15px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .half-width {
    width: 50%;
    margin-bottom: 0;
  }
  
  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #555;
    margin-bottom: 8px;
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
    padding: 14px 15px 14px 45px;
    border: 1px solid #e0e6ed;
    border-radius: 12px;
    font-size: 14px;
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
  
  .visibility-toggle {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #aaa;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .visibility-toggle:hover {
    color: #555;
  }
  
  .signup-button {
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
    margin-top: 25px;
  }
  
  .signup-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  .signup-button:hover::before {
    left: 100%;
  }
  
  .signup-button:hover {
    background: linear-gradient(to right, #1745c5, #081d54);
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(30, 80, 226, 0.25);
  }
  
  .signup-button:disabled {
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
    color: red;
    font-size: 12px;
    margin-top: 5px;
  }
  
  .error-alert {
    display: flex;
    align-items: center;
    background: rgba(255, 0, 0, 0.1);
    color: red;
    padding: 10px;
    border-radius: 8px;
    margin-top: 20px;
  }
  
  .error-alert i {
    margin-right: 10px;
  }
  
  .login-link {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #555;
  }
  
  .link {
    color: #1e50e2;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .link:hover {
    color: #0a2463;
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .signup-card {
      flex-direction: column;
      width: 95%;
    }
    
    .brand-section {
      width: 100%;
      padding: 30px 20px;
    }
    
    .signup-form-section {
      width: 100%;
      padding: 30px 20px;
    }
    
    .form-row {
      flex-direction: column;
      gap: 20px;
    }
    
    .half-width {
      width: 100%;
    }
  }
  </style>