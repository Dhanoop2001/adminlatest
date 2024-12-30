<template>
    <div class="app-container">
      <!-- Sidebar -->
      <div class="sidebar" v-bind:class="{ 'open': drawer }">
        <div class="sidebar-header">
          <h2 class="title">Salon Admin</h2>
        </div>
        <div class="sidebar-menu">
          <div 
            class="menu-item" 
            v-for="item in menuItems" 
            :key="item.title" 
            @click="navigateTo(item.route)"
          >
            <i class="menu-icon">{{ item.icon }}</i>
            <span class="menu-title">{{ item.title }}</span>
          </div>
        </div>
      </div>
  
      <!-- Arrow Toggle Button -->
      <button class="toggle-arrow-btn" @click="drawer = !drawer">
        <span class="arrow" :class="{ 'left': drawer, 'right': !drawer }"></span>
      </button>
  
      <!-- Header -->
      <div class="header">
        <h1 class="header-title">Admin Dashboard</h1>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
  
      <!-- Main Content -->
      <div class="main-content">
        <div class="cards-container">
          <div class="card" v-for="card in cards" :key="card.title">
            <img :src="card.img" alt="Card image" class="card-img">
            <h3 class="card-title">{{ card.title }}</h3>
            <div class="card-actions">
              <button class="manage-btn" @click="manage(card.route)">Manage</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        drawer: false,
        menuItems: [
          { title: 'Dashboard', icon: '🏠', route: '/dashboard' },
          { title: 'Services', icon: '✂️', route: '/services' },
          { title: 'Staff', icon: '👥', route: '/staff' },
          { title: 'Appointments', icon: '📅', route: '/appointments' },
          { title: 'Clients', icon: '👤', route: '/clients' }
        ],
        cards: [
          { title: 'Manage Services', img: 'https://via.placeholder.com/200', route: '/services' },
          { title: 'Manage Staff', img: 'https://via.placeholder.com/200', route: '/staff' },
          { title: 'Appointments', img: 'https://via.placeholder.com/200', route: '/appointments' }
        ]
      };
    },
    methods: {
      navigateTo(route) {
        this.$router.push(route);
      },
      manage(route) {
        this.$router.push(route);
      },
      logout() {
        this.$router.push('/log-in');
      }
    }
  };
  </script>
  
  <style scoped>
  .app-container {
    display: flex;
    height: 100vh;
    background: url('@/assets/salon.jpg') no-repeat center center fixed;
    background-size: cover;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 250px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 20px;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar-header {
    margin-bottom: 30px;
  }
  
  .title {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .sidebar-menu {
    flex-grow: 1;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 15px;
    cursor: pointer;
  }
  
  .menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .menu-icon {
    margin-right: 10px;
  }
  
  .header {
    flex: 1;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 500;
  }
  
  .header-title {
    font-size: 1.8rem;
    font-weight: bold;
  }
  
  .logout-btn {
    background: transparent;
    border: none;
    color: #fff;
    font-size: .8rem;
    cursor: pointer;
    border: 1px solid white;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 800px;
  }
  
  .toggle-arrow-btn {
    position: fixed;
    top: 20px;
    margin-top: 25px;
    left: 20px;
    z-index: 1100;
    background: black;
    border: none;
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .toggle-arrow-btn:hover {
    background: black;
    
  }
  
  .arrow {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-top: 2px solid white;
    border-right: 2px solid white;
    transform: rotate(45deg);
    transition: transform 0.3s ease-in-out;
  }
  
  .arrow.left {
    transform: rotate(-135deg);
  }
  
  .arrow.right {
    transform: rotate(45deg);
  }
  
  .main-content {
    flex: 3;
    padding: 20px;
    overflow-y: auto;
    margin-left: 100px;
    transition: margin-left 0.3s ease-in-out;
  }
  
  .sidebar.open + .main-content {
    margin-left: 0;
  }
  
  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    justify-content: center;
    align-items: center;
  }
  
  .card {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .card-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .card-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 10px 0;
  }
  
  .card-actions {
    padding: 10px;
  }
  
  .manage-btn {
    background-color: #3f51b5;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .manage-btn:hover {
    background-color: #303f9f;
  }
  </style>
  