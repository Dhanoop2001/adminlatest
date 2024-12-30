<template>
  <div class="home-page">
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
  color: white;
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
  background-color: #5e8fc469;
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
  background-color: rgba(105, 154, 247, 0.5); /* Green for signup */
}

.ripple-login {
  background-color: rgba(105, 154, 247, 0.5); /* Green for signup */
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
