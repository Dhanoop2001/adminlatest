<template>
  <div class="admin-panel">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo-container">
        <h1 class="logo">DASHPRO</h1>
      </div>
      
      <div class="menu">
        <div class="menu-item active">
          <i class="icon dashboard-icon">◙</i>
          <span>Dashboard</span>
        </div>
        <div class="menu-item" @click="navigateToParlours">
          <i class="icon parlour-icon">✂</i>
          <span>Admin Parlour</span>
        </div>
        <div class="menu-item">
          <i class="icon offer-icon">🎁</i>
          <span>Offers</span>
        </div>
        <div class="menu-item">
          <i class="icon category-icon">📁</i>
          <span>Categories</span>
        </div>
        
        <div class="menu-item logout" @click="logout">
          <i class="icon logout-icon">↪</i>
          <span>Logout</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <br>

      <!-- Page Content -->
      <div class="page-content">
        <div class="page-header">
          <h2>Admin Dashboard</h2>
          <div class="date-display">{{ currentDate }}</div>
        </div>

        <!-- Stats Overview -->
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon parlour">✂</div>
            <div class="stat-details">
              <h3>Parlours</h3>
              <div class="stat-number">{{ parlourCount }}</div>
              <div class="stat-change positive">+12% from last month</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon offers">🎁</div>
            <div class="stat-details">
              <h3>Active Offers</h3>
              <div class="stat-number">{{ offerCount }}</div>
              <div class="stat-change positive">+8% from last month</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon categories">📁</div>
            <div class="stat-details">
              <h3>Categories</h3>
              <div class="stat-number">{{ categoryCount }}</div>
              <div class="stat-change neutral">No change</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon revenue">💰</div>
            <div class="stat-details">
              <h3>Revenue</h3>
              <div class="stat-number">${{ revenue }}</div>
              <div class="stat-change positive">+15% from last month</div>
            </div>
          </div>
        </div>

        <!-- Main Sections -->
        <div class="section-content">
          <h3>Recent Activities</h3>
          <!-- Add your content here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'AdminPanel',
  data() {
    return {
      currentDate: new Date().toLocaleDateString(),
      parlourCount: 0,
      offerCount: 0,
      categoryCount: 0,
      revenue: 0,
    };
  },
  setup() {
    const router = useRouter();

    const navigateToParlours = () => {
      router.push('/admin-parlours');
    };

    const logout = () => {
      localStorage.removeItem('authToken'); // Remove the token
      router.push('/login'); // Redirect to login page
    };

    return {
      navigateToParlours,
      logout,
    };
  },
  created() {
    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      const token = localStorage.getItem('authToken'); // Retrieve the token
      if (!token) {
        console.error('No token found. User might not be logged in.');
        this.logout(); // Redirect to login if no token
        return;
      }

      try {
        const response = await axios.get('http://192.168.1.200:8086/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Assuming the response contains the counts
        this.parlourCount = response.data.parlourCount || 0;
        this.offerCount = response.data.offerCount || 0;
        this.categoryCount = response.data.categoryCount || 0;
        this.revenue = response.data.revenue || 0;

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Handle error appropriately
      }
    }
  }
};
</script>

<style scoped>
.admin-panel {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  color: #333;
  background-color: #f8f9fd;
}

/* Sidebar Styles */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #4b6cb7 0%, #182848 100%);
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.logo-container {
  padding: 20px 0;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
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
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.icon {
  margin-right: 12px;
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.menu-item.logout {
  margin-top: auto;
  color: #ff7675;
}

/* Main Content Styles */
.main-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.date-display {
  color: #777;
  font-size: 14px;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 15px;
}

.stat-details h3 {
  margin: 0;
  font-size: 14px;
  color: #777;
  font-weight: 500;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  margin: 5px 0;
}

.stat-change {
  font-size: 12px;
}

.stat-change.positive {
  color: #52c41a;
}

.stat-change.negative {
  color: #f5222d;
}

.stat-change.neutral {
  color: #777;
}
</style>