<template>
  <div class="admin-panel">
    <SideBar />
    
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
import SideBar from '@/components/SideBar.vue';

export default {
  name: 'AdminPanel',
  components: {
    SideBar
  },
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
      router.push('/'); // Redirect to login page
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
      // Simulating an API response with dummy data
      const dummyData = {
        parlourCount: 25,
        offerCount: 10,
        categoryCount: 5,
        revenue: 15000,
      };

      // Using dummy data instead
      this.parlourCount = dummyData.parlourCount;
      this.offerCount = dummyData.offerCount;
      this.categoryCount = dummyData.categoryCount;
      this.revenue = dummyData.revenue;
    },
  },
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