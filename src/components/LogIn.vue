<template>
  <div class="signup-container">
    <div class="form-section">
      <h1 class="heading">SIGN IN</h1>
      
      <form @submit.prevent="handleSubmit">
        
        
        <div class="form-group">
          <label for="email">Email address</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            placeholder="Enter your email" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            placeholder="Enter your password" 
            required
          />
        </div>
        
        
        
        <button type="submit" class="signup-button">Sign in</button>
        
        
        
        
        
        
      </form>
    </div>
    
    <div class="image-section">
      <!-- Monstera leaf image background will be set with CSS -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignupPage',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        termsAccepted: false
      }
    }
  },
  methods: {
    handleSubmit() {
      // Handle form submission here
      console.log('Form submitted:', this.form);
      // You would typically call an API endpoint here
    },
    signInWithGoogle() {
      console.log('Sign in with Google clicked');
      // Implement Google OAuth login
    },
    signInWithApple() {
      console.log('Sign in with Apple clicked');
      // Implement Apple OAuth login
    },
    goToLogin() {
      console.log('Redirecting to login page');
      // Redirect to login page
      // this.$router.push('/login');
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

.image-section {
  flex: 1;
  background-image: url('@/assets/hair.jpg');
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

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.terms-checkbox input {
  margin-right: 0.5rem;
}

.terms-link {
  color: #444;
  text-decoration: underline;
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

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background-color: white;
  padding: 0 10px;
  position: relative;
  z-index: 1;
}

.social-logins {
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.75rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.social-btn:hover {
  background-color: #f5f5f5;
}

.login-link {
  text-align: center;
}

.login-link a {
  color: #3a6832;
  font-weight: 500;
  text-decoration: none;
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
  
  .social-logins {
    flex-direction: column;
  }
}
</style>