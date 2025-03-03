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
      <h1 class="header-title">Admin Panel</h1>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="cards-container">
        <div class="card" v-for="card in cards" :key="card.title">
          <h3 class="card-title">{{ card.title }}</h3>
          <div class="card-actions">
            <button class="manage-btn" @click="manage(card.route)">
              MANAGE
            </button>
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
        { title: "Dashboard", icon: "🏠", route: "/dashboard" },
        { title: "Overview", icon: "👤", route: "/admin-overview" },
        { title: "GST",  route: "/gst-page" },
        { title: "APP CHARGE",  route: "/app-charge" },
        
      ],
      cards: [
        { title: "Offers", route: "/admin-offers" },
        { title: "Category", route: "/admin-category" },
        { title: "Parlours", route: "/admin-parlours" },
      ],
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
      this.$router.push("/log-in");
    },
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  position: relative;
  background: url("@/assets/salon.jpg") no-repeat center center fixed;
  background-size: cover;
}

.app-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.527); /* Light black overlay */
  z-index: 0; /* Ensure overlay is behind content */
}

.header,
.sidebar,
.main-content {
  z-index: 1; /* Ensure content is above overlay */
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
  font-size: 0.8rem;
  cursor: pointer;
  border: 1px solid white;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 800px;
}

.logout-btn:hover {
  color: white;
  border: 1px solid white;
}

.toggle-arrow-btn {
  position: fixed;
  top: 50px;
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

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 330px;
}

.card {
  background-color: white;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid black;
  color: black;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 20px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.card-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin: 20px 0;
  color: black;
}

.card-actions {
  padding: 10px;
  background-color: black;
  border-top: 2px solid black;
}

.manage-btn {
  background-color: white;
  color: black;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: bolder;
  font-size: small;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.manage-btn:hover {
  border: 1px solid white;
  color: white;
  background-color: transparent;
  transform: scale(1.1);
}
</style>

