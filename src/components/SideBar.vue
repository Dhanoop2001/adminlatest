<template>
  <div class="sidebar">
    <div class="logo-container">
      <div class="logo-section">
        <div class="logo-icon">
          <i class="fas fa-spa"></i>
        </div>
        <div class="logo-text">
          <h1 class="logo-title">SalonInfo</h1>
        </div>
      </div>
      <div class="logo-divider"></div>
    </div>
    
    <div class="menu">
      <div class="menu-section">
        <div class="section-label">Main Navigation</div>
        
        <div class="menu-item" :class="{ active: isActive('/admin-dashboard') }" @click="navigate('/admin-dashboard')">
          <div class="menu-item-content">
            <i class="icon fas fa-chart-pie"></i>
            <span class="menu-text">Dashboard</span>
          </div>
          <div class="menu-indicator"></div>
        </div>
        
        <div class="menu-item" :class="{ active: isActive('/admin-parlours') }" @click="navigate('/admin-parlours')">
          <div class="menu-item-content">
            <i class="icon fas fa-store"></i>
            <span class="menu-text">Parlours</span>
          </div>
          <div class="menu-indicator"></div>
        </div>
        
        <div class="menu-item" :class="{ active: isActive('/admin-panel') }" @click="navigate('/admin-panel')">
          <div class="menu-item-content">
            <i class="icon fas fa-cogs"></i>
            <span class="menu-text">Control Panel</span>
          </div>
          <div class="menu-indicator"></div>
        </div>
      </div>
      
      <div class="menu-section">
        <div class="section-label">Management</div>
        
        <div class="menu-item" :class="{ active: isActive('/app-charge') }" @click="navigate('/app-charge')">
          <div class="menu-item-content">
            <i class="icon fas fa-coins"></i>
            <span class="menu-text">App Charges</span>
          </div>
          <div class="menu-indicator"></div>
        </div>
        
        <div class="menu-item" :class="{ active: isActive('/admin-offers') }" @click="navigate('/admin-offers')">
          <div class="menu-item-content">
            <i class="icon fas fa-gift"></i>
            <span class="menu-text">Offers & Deals</span>
          </div>
          <div class="menu-indicator"></div>
        </div>
        
        <div class="menu-item" :class="{ active: isActive('/admin-users') }" @click="navigate('/admin-users')">
          <div class="menu-item-content">
            <i class="icon fas fa-users"></i>
            <span class="menu-text">Users</span>
          </div>
          <div class="menu-indicator"></div>
        </div>
        
        <div class="menu-item" :class="{ active: isActive('/admin-employees') }" @click="navigate('/admin-employees')">
          <div class="menu-item-content">
            <i class="icon fas fa-user-tie"></i>
            <span class="menu-text">Employees</span>
          </div>
          <div class="menu-indicator"></div>
        </div>
      </div>
      
      <div class="menu-bottom">
        <div class="menu-item logout" @click="showLogoutPopup">
          <div class="menu-item-content">
            <i class="icon fas fa-sign-out-alt"></i>
            <span class="menu-text">Sign Out</span>
          </div>
          <div class="logout-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Popup -->
    <div v-if="isLogoutPopupVisible" class="popup-overlay" @click="hideLogoutPopup">
      <div class="popup-container" @click.stop>
        <div class="popup-header">
          <div class="popup-icon">
            <i class="fas fa-sign-out-alt"></i>
          </div>
          <h3>Confirm Sign Out</h3>
          <button class="close-btn" @click="hideLogoutPopup">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="popup-content">
          <p>Are you sure you want to sign out? You will need to authenticate again to access the admin portal.</p>
        </div>
        <div class="popup-actions">
          <button class="btn-cancel" @click="hideLogoutPopup">
            <i class="fas fa-times"></i>
            Cancel
          </button>
          <button class="btn-confirm" @click="confirmLogout">
            <i class="fas fa-sign-out-alt"></i>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isLogoutPopupVisible = ref(false);

const navigate = (path) => {
  if (route.path !== path) {
    router.push(path);
  }
};

const isActive = (path) => route.path === path;

const showLogoutPopup = () => {
  isLogoutPopupVisible.value = true;
};

const hideLogoutPopup = () => {
  isLogoutPopupVisible.value = false;
};

const confirmLogout = () => {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('admin_token');
  hideLogoutPopup();
  router.push('/');
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
  --shadow-light: rgba(44, 24, 16, 0.08);
  --shadow-medium: rgba(44, 24, 16, 0.15);
  --shadow-heavy: rgba(44, 24, 16, 0.25);
}

.sidebar {
  width: 280px;
  min-width: 280px;
  background: linear-gradient(180deg, var(--primary-brown) 0%, var(--secondary-brown) 100%);
  color: var(--white);
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  box-shadow: 4px 0 20px var(--shadow-medium);
}

/* Background decoration */
.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 25%),
    linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
  pointer-events: none;
  z-index: 1;
}

.logo-container {
  padding: 30px 25px 25px;
  position: relative;
  z-index: 2;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.logo-icon i {
  font-size: 24px;
  color: var(--white);
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-title {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  color: var(--white);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.logo-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.logo-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
}

.menu {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  position: relative;
  z-index: 2;
}

.menu-section {
  margin-bottom: 30px;
  padding: 0 25px;
}

.section-label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(96, 94, 94, 0.6);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 15px;
  padding-left: 5px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  margin-bottom: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.menu-item:hover::before {
  width: 100%;
}

.menu-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.menu-item.active .menu-indicator {
  opacity: 1;
  transform: scale(1);
}

.menu-item-content {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  flex-grow: 1;
  position: relative;
  z-index: 2;
}

.icon {
  font-size: 18px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: var(--white);
}

.menu-text {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: var(--white);
  letter-spacing: 0.3px;
}

.menu-indicator {
  width: 4px;
  height: 24px;
  background: var(--white);
  border-radius: 2px;
  margin-right: 8px;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-bottom {
  margin-top: auto;
  padding: 0 25px 25px;
}

.menu-item.logout {
  background: rgba(211, 47, 47, 0.1);
  border: 1px solid rgba(211, 47, 47, 0.2);
  margin-bottom: 0;
}

.menu-item.logout:hover {
  background: rgba(211, 47, 47, 0.2);
  border-color: rgba(211, 47, 47, 0.4);
}

.menu-item.logout .menu-text {
  color: #c07171;
}

.menu-item.logout .icon {
  color: #c07171;
}

.logout-arrow {
  padding-right: 18px;
  color: #c07171;
  font-size: 14px;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.menu-item.logout:hover .logout-arrow {
  opacity: 1;
  transform: translateX(3px);
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 24, 16, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: overlay-enter 0.3s ease-out;
}

@keyframes overlay-enter {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

.popup-container {
  background: var(--white);
  color: var(--text-dark);
  border-radius: 20px;
  box-shadow: 
    0 40px 80px rgba(44, 24, 16, 0.4),
    0 20px 40px rgba(44, 24, 16, 0.3);
  max-width: 450px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: popup-enter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes popup-enter {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 30px 30px 20px;
  border-bottom: 1px solid var(--cream);
  position: relative;
}

.popup-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 20px;
}

.popup-header h3 {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
  flex-grow: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--text-light);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: absolute;
  top: 20px;
  right: 20px;
}

.close-btn:hover {
  background: rgba(147, 111, 90, 0.1);
  color: var(--primary-brown);
}

.popup-content {
  padding: 25px 30px;
}

.popup-content p {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-medium);
}

.popup-actions {
  display: flex;
  gap: 15px;
  padding: 20px 30px 30px;
  justify-content: flex-end;
}

.btn-cancel, .btn-confirm {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.3px;
}

.btn-cancel {
  background: var(--cream);
  color: var(--text-medium);
  border: 1px solid rgba(147, 111, 90, 0.2);
}

.btn-cancel:hover {
  background: #DDD2C4;
  color: var(--text-dark);
  transform: translateY(-1px);
}

.btn-confirm {
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
  box-shadow: 0 4px 12px rgba(147, 111, 90, 0.3);
}

.btn-confirm:hover {
  background: linear-gradient(135deg, var(--dark-brown), var(--secondary-brown));
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(147, 111, 90, 0.4);
}

.btn-confirm:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 70px;
    min-width: 70px;
  }
  
  .logo-section {
    justify-content: center;
  }
  
  .logo-text, .section-label {
    display: none;
  }
  
  .menu-text {
    display: none;
  }
  
  .menu-item-content {
    justify-content: center;
    padding: 14px;
  }
  
  .icon {
    margin-right: 0;
  }
  
  .menu-indicator {
    display: none;
  }
  
  .logout-arrow {
    display: none;
  }
}
</style>