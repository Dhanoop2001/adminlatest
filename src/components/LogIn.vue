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
      <div class="form-group forgot-password">
        <span>
          <a href="#" @click.prevent="openForgotPasswordModal">Forgot Password?</a>
        </span>
      </div>
    </form>

    <!-- Forgot Password Modal -->
    <div v-if="isModalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>Reset Your Password</h3>
        <p>Please enter your email address to receive password reset instructions.</p>
        <input
          type="email"
          v-model="resetEmail"
          placeholder="Enter your email"
          required
        />
        <div class="modal-actions">
          <button @click="handlePasswordReset" class="reset-button">Send Reset Link</button>
          <button @click="closeModal" class="close-button">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store"; // Import Vuex store for API base URL

export default {
  name: "AdminLogin",
  data() {
    return {
      isPasswordVisible: false,
      email: "",
      password: "",
      isModalVisible: false,
      resetEmail: "",
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    async handleLogin() {
      if (!this.email || !this.password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        console.log("Sending login request...");
        const response = await fetch(`${store.state.baseURL}/admin/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();
        console.log("Response:", data);

        if (response.ok && data.token) {
          localStorage.setItem("token", data.token);
          this.$router.push("/admin-panel"); // Redirect on successful login
        } else {
          alert(data.message || "Invalid email or password.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login. Please check the console.");
      }
    },
    openForgotPasswordModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    handlePasswordReset() {
      if (this.resetEmail) {
        console.log(`Password reset email sent to: ${this.resetEmail}`);
        alert(`Password reset email has been sent to ${this.resetEmail}.`);
        this.closeModal();
      } else {
        alert("Please enter a valid email address.");
      }
    },
  },
};
</script>

<style scoped>
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
  font-size: 0.8rem;
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
}

.forgot-password a:hover {
  text-decoration: underline;
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

.modal-content input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
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
}

.reset-button {
  background-color: gold;
  color: black;
  font-weight: bold;
}

.close-button {
  background-color: black;
  color: white;
}
</style>
