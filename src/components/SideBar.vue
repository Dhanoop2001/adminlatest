<template>
  <div class="sidebar">
    <div class="logo-container">
      <h1 class="logo">ADMIN DASHBOARD</h1>
    </div>
    
    <div class="menu">
      <div class="menu-item" :class="{ active: isActive('/admin-dashboard') }" @click="navigate('/admin-dashboard')">
        <i class="icon fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </div>
      <div class="menu-item" :class="{ active: isActive('/admin-parlours') }" @click="navigate('/admin-parlours')">
        <i class="icon fas fa-store"></i>
        <span>Admin Parlour</span>
      </div>
      <div class="menu-item" :class="{ active: isActive('/admin-offers') }" @click="navigate('/admin-offers')">
        <i class="icon fas fa-tags"></i>
        <span>Offers</span>
      </div>
      <div class="menu-item" :class="{ active: isActive('/admin-categories') }" @click="navigate('/admin-categories')">
        <i class="icon fas fa-list"></i>
        <span>Categories</span>
      </div>
      <div class="menu-item" :class="{ active: isActive('/admin-panel') }" @click="navigate('/admin-panel')">
        <i class="icon fas fa-cog"></i>
        <span>Admin Panel</span>
      </div>
      <div class="menu-item logout" @click="logout">
        <i class="icon fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const navigate = (path) => {
  if (route.path !== path) {
    router.push(path);
  }
};

const isActive = (path) => route.path === path;

const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/');
};
</script>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  background: linear-gradient(180deg, #4b6cb7 0%, #182848 100%);
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}

.logo-container {
  padding: 20px 0;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
  line-height: 1.2;
  transition: none;
}

.menu {
  margin-top: 30px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 5px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease, font-weight 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.icon {
  margin-right: 12px;
  font-size: 18px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  display: inline-block;
}

.menu-item.logout {
  margin-top: auto;
  color: #ff7675;
}
</style>