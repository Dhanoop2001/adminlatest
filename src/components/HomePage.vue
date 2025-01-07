<template>
  <div class="home-page">
    <!-- Logo and Website Name Section -->
    <div class="logo-container">
      <img src="@/assets/spalogo.png" alt="Spa Logo" class="spa-logo" />
      <span class="website-name">Salon Info</span>
    </div>

    <div class="blue-box">
      <h1>Welcome, Admin</h1>
      <div class="button-container">
        <button 
          class="btn signup-btn" 
          @click="triggerRipple('signup')"
        >
          SIGN UP
        </button>
        <button 
          class="btn login-btn" 
          @click="triggerRipple('login')"
        >
          LOGIN
        </button>
      </div>
    </div>
    <div 
      v-if="isRippling" 
      :class="['ripple', rippleClass]" 
      @animationend="handleRippleEnd"
    ></div>
  </div>
</template>

<script>
export default {
  name: "AdminHomePage",
  data() {
    return {
      isRippling: false,
      rippleClass: "",
    };
  },
  methods: {
    triggerRipple(type) {
      this.isRippling = true;
      this.rippleClass = type === "signup" ? "ripple-signup" : "ripple-login";
      
      // Navigate to respective pages after ripple
      setTimeout(() => {
        if (type === "signup") {
          this.$router.push("/sign-up");
        } else {
          this.$router.push("/log-in");
        }
      }, 1000); // Adjust timing if needed
    },
    handleRippleEnd() {
      this.isRippling = false;
      this.rippleClass = "";
    },
  },
};
</script>

<style>
.home-page {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/background2.jpg');
  background-size: cover;
  background-position: center;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.home-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(94, 143, 196, 0.4);
  z-index: -1;
}

.logo-container {
  position: absolute;
  top: 1rem; /* Adjust top spacing */
  left: 1rem; /* Adjust left spacing */
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Spacing between logo and website name */
}

.spa-logo {
  width: 100px; /* Adjust size of logo */
  height: auto;
}

.website-name {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(180deg, gold, white);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none; /* Remove text-shadow to let the gradient shine */
}

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
}

.button-container {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: black;
  color: gold;
}

.signup-btn {
  background-color: white;
  color: black;
}

.login-btn {
  background-color: white;
  color: black;
}

.blue-box {
  background-color: rgba(0, 0, 0, 0.534);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.ripple {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  animation: rippleEffect 1s forwards ease-in-out;
}

.ripple-signup {
  background-color: rgba(34, 34, 32, 0.521);
}

.ripple-login {
  background-color: rgba(34, 34, 32, 0.521);
}

@keyframes rippleEffect {
  from {
    width: 0;
    height: 0;
    opacity: 0.8;
  }
  to {
    width: 200vw;
    height: 200vh;
    opacity: 0;
  }
}
</style>
