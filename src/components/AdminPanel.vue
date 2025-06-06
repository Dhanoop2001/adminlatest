<template>
  <div class="admin-panel">
    <SideBar />

    <div class="main-content">
      <div class="background">
        <div class="floating-elements">
          <div class="floating-shape shape-1"></div>
          <div class="floating-shape shape-2"></div>
          <div class="floating-shape shape-3"></div>
          <div class="floating-shape shape-4"></div>
        </div>
        <div class="overlay">
          <div class="container">
            <h1 class="title">Admin Panel</h1>

            <div class="stat-card">
              <h2>Approved Parlours</h2>
              <p class="count">{{ approvedParlourCount }}</p>
            </div>

            <div class="stat-card">
              <h2>Total Revenue</h2>
              <p class="count">₹ {{ totalRevenue }}</p>
              <div class="revenue-details" v-if="approvedParlours.length">
                <h3>Revenue by Parlour:</h3>
                <ul>
                  <li v-for="parlour in approvedParlours" :key="parlour.id">
                    {{ parlour.parlourName }}: ₹ {{ parlour.revenue || 0 }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from './SideBar.vue';
import axios from 'axios';

export default {
  name: 'AdminPanel',
  components: {
    SideBar
  },
  data() {
    return {
      approvedParlourCount: 0,
      totalRevenue: 0,
      approvedParlours: [] // Array to hold approved parlours with revenue
    };
  },
  methods: {
    async fetchApprovedParlours() {
      try {
        const response = await axios.get("http://192.168.1.19:8086/api/admin/allRegisteredParlour");
        this.approvedParlours = response.data.filter(p => p.status === 1); // status 1 means approved
        this.approvedParlourCount = this.approvedParlours.length;
        this.totalRevenue = this.approvedParlours.length
          ? this.approvedParlours.reduce((sum, parlour) => sum + (parlour.revenue || 0), 0)
          : 0;
      } catch (error) {
        console.error("Error fetching approved parlours:", error);
        this.totalRevenue = 0; // fallback on error
      }
    }
  },
  mounted() {
    this.fetchApprovedParlours();
  }
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

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-panel {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, var(--cream) 0%, #F5F0EA 50%, var(--cream) 100%);
  position: relative;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow-y: auto;
}

.background {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(147, 111, 90, 0.12), rgba(145, 73, 52, 0.06));
  animation: float 25s infinite ease-in-out;
  backdrop-filter: blur(1px);
}

.shape-1 {
  width: 400px;
  height: 400px;
  top: -150px;
  left: -200px;
  animation-delay: 0s;
}

.shape-2 {
  width: 350px;
  height: 350px;
  bottom: -120px;
  right: -180px;
  animation-delay: -8s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  top: 15%;
  right: 8%;
  animation-delay: -16s;
}

.shape-4 {
  width: 180px;
  height: 180px;
  bottom: 30%;
  left: 5%;
  animation-delay: -24s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0) rotate(0deg) scale(1); 
    opacity: 0.6;
  }
  25% { 
    transform: translateY(-30px) rotate(2deg) scale(1.05); 
    opacity: 0.8;
  }
  50% { 
    transform: translateY(-50px) rotate(-1deg) scale(0.95); 
    opacity: 0.4;
  }
  75% { 
    transform: translateY(-20px) rotate(1deg) scale(1.02); 
    opacity: 0.7;
  }
}

.overlay {
  background: var(--white);
  padding: 40px;
  border-radius: 28px;
  width: 90%;
  max-width: 600px;
  text-align: center;
  box-shadow: 
    0 25px 50px -12px var(--shadow-heavy),
    0 10px 20px -5px var(--shadow-medium);
  position: relative;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.title {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 30px;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px var(--shadow-light);
}

.stat-card {
  background: linear-gradient(135deg, var(--primary-brown) 0%, var(--secondary-brown) 100%);
  padding: 20px;
  border-radius: 16px;
  margin-top: 20px;
  color: var(--white);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 16px var(--shadow-medium),
    0 4px 8px var(--shadow-light);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 12px 24px var(--shadow-heavy),
    0 6px 12px var(--shadow-medium);
}

.stat-card h2 {
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
}

.count {
  font-size: 28px;
  font-weight: 700;
  color: var(--white);
}

.revenue-details {
  text-align: left;
  margin-top: 10px;
}

.revenue-details h3 {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.revenue-details ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.revenue-details li {
  font-size: 16px;
  margin: 3px 0;
  opacity: 0.9;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .overlay {
    padding: 30px;
    max-width: 90%;
  }

  .title {
    font-size: 30px;
  }

  .stat-card h2 {
    font-size: 20px;
  }

  .count {
    font-size: 24px;
  }

  .revenue-details h3 {
    font-size: 16px;
  }

  .revenue-details li {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .admin-panel {
    flex-direction: column;
  }

  .main-content {
    padding: 20px;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .overlay {
    padding: 25px;
    max-width: 95%;
  }

  .title {
    font-size: 26px;
  }

  .stat-card {
    padding: 15px;
  }

  .stat-card h2 {
    font-size: 18px;
  }

  .count {
    font-size: 22px;
  }

  .revenue-details li {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 22px;
  }

  .stat-card h2 {
    font-size: 16px;
  }

  .count {
    font-size: 20px;
  }

  .overlay {
    padding: 20px;
  }

  .revenue-details h3 {
    font-size: 14px;
  }

  .revenue-details li {
    font-size: 12px;
  }

  .floating-shape {
    display: none; /* Hide floating shapes on small screens for performance */
  }
}
</style>