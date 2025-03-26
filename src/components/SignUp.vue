<!-- <template>
  <div class="signup-container">
   
    <div class="back-icon" @click="$router.push('/')"
      :style="{ pointerEvents: showSuccessPopup ? 'none' : 'auto' }"
      :class="{ 'disabled': showSuccessPopup }"
    >
      <i class="fas fa-arrow-left"></i>
      <span>&lt;</span>
    </div>

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
          :class="{'error-border': errors.name}"
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
          :class="{'error-border': errors.email}"
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
            :class="{'error-border': errors.password}"
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
          <option value="male">Male</option>
          <option value="female">Female</option>
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

   
    <div v-if="showSuccessPopup">
      <div class="blur-overlay"></div>
      <div class="success-popup">
        <p>Registration Successful!</p>
        <button @click="closePopup">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
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
        email: "",
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
      this.validateName();
      this.validatePassword();

      if (!this.errors.name && !this.errors.password && this.email && this.gender) {
        this.isSubmitting = true;

        try {
          console.log("Simulating successful registration.");
          this.showSuccessPopup = true;
        } catch (error) {
          console.error("Registration failed", error);
          alert("An error occurred during registration. Please try again.");
        } finally {
          this.isSubmitting = false;
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
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('@/assets/goldbg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.back-icon {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid gold;
  color: gold;
  border-radius: 50%;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  font-size: 1.7rem;
  font-weight: bold;
  cursor: pointer;
  z-index: 1000; /* Ensure it stays on top of other elements */
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.back-icon:hover {
  transform: scale(1.1);
}

.back-icon:active {
  transform: scale(0.95);
}

.disabled {
  opacity: 0.0;
  cursor: not-allowed;
}


.signup-heading {
  font-size: 3rem;
  color: #fff;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
  font-family: "Arial", sans-serif;
}

.signup-form {
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 450px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: solid 1px gold;
}

.signup-form:hover {
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

input, select {
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

input:focus, select:focus {
  background-color: black;
  outline: none;
  border: 2px solid gold;
  border-radius: 30px;
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
  text-decoration: underline;
}

.signup-button {
  width: 100%;
  padding: 1rem;
  background-color: black;
  color: #fff;
  border: 1px solid gold;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease-in-out;
}

.signup-button:hover {
  background-color: black;
  transform: translateY(-2px);
  border: 1px solid gold;
}

.signup-button:active {
  background-color: gold;
  transform: translateY(1px);
}

.signup-button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

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

.success-popup {
  position: fixed;
  height: 200px;
  width: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: black;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  z-index: 1000;
  border: 2px solid gold;
}

.success-popup p {
  font-size: 2rem;
  color: white;
  margin-top: 2rem;
  font-weight: bold;
}

.success-popup button {
  padding: 0.9rem 1.7rem;
  background-color: gold;
  color: black;
  border: none;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease-in-out;
  margin-top: 30px;
}

.success-popup button:hover {
  background-color: #ffd700; /* Slightly lighter gold */
  transform: translateY(-2px);
}

.success-popup button:active {
  background-color: #daa520; /* Darker gold */
  transform: translateY(1px);
}

.blur-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  z-index: 999; /* Ensure it's above other content */
}

.error-message {
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.error-border {
  border: 2px solid red !important;
}
</style> -->
