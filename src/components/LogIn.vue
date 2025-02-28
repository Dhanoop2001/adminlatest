<template>
  <v-app>
    <v-container fluid class="bg-image">
      <div class="login-wrapper">
        <v-card class="glassmorphic-card pa-5" elevation="10" width="400">
          <v-card-title class="text-center text-h5 font-weight-bold">Admin Login</v-card-title>
          <v-card-text>
            <v-alert v-if="errorMessage" type="error" class="mb-3" dense>{{ errorMessage }}</v-alert>

            <v-form ref="loginForm" @submit.prevent="login">
              <v-text-field
                v-model="email"
                label="Email Address"
                type="email"
                variant="outlined"
                color="primary"
                :rules="[rules.required, rules.email]"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                variant="outlined"
                color="primary"
                :rules="[rules.required, rules.minLength]"
              >
                <template v-slot:append-inner>
                  <v-icon @click="showPassword = !showPassword" class="cursor-pointer">
                    {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                  </v-icon>
                </template>
              </v-text-field>

              <v-btn 
                :loading="loading" 
                color="primary" 
                block 
                class="mt-4 glass-button" 
                type="submit"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      loading: false,
      errorMessage: "",
      rules: {
        required: value => !!value || "This field is required",
        email: value => /.+@.+\..+/.test(value) || "E-mail must be valid",
        minLength: value => (value && value.length >= 8) || "Password must be at least 8 characters",
      },
    };
  },
  methods: {
    async login() {
      const { valid } = await this.$refs.loginForm.validate();
      if (!valid) return;

      this.loading = true;
      this.errorMessage = "";

      
      try {
        const response = await axios.post("http://192.168.1.200:8086/api/admin/AdminLogin", {
          email: this.email,
          password: this.password,
        }, {
          headers: { "Content-Type": "application/json" }
        });

        sessionStorage.setItem("adminToken", response.data);
        this.$router.push("/admin-panel");
      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Invalid Credentials";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Full-Screen Background */
/* Full-Screen Background */
.bg-image {
  background: linear-gradient(to bottom, white, black);
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}


/* Centering Login Box */
.login-wrapper {
  
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* Glassmorphic Card */
/* Glassmorphic Card */
.glassmorphic-card {
  border-radius: 12px;
  backdrop-filter: blur(20px); /* Increased blur effect */
  background: rgba(255, 255, 255, 0.15); /* Light frosted effect */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}


/* Glassmorphic Button */
.glass-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: bold;
}

/* Password Toggle Icon */
.cursor-pointer {
  cursor: pointer;
}
</style>
