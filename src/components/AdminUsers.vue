<template>
  <v-app>
    <v-container fluid class="pa-0">
      <div class="floating-elements">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>
      <v-row no-gutters class="flex-container">
        <!-- Sidebar -->
        <v-col cols="12" sm="3" md="2" class="sidebar">
          <SideBar />
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" sm="9" md="10" class="main-content">
          <v-container class="content-container">
            <h1 class="my-4 page-title">All Registered Users</h1>

            <div v-if="loading" class="loading">Loading users...</div>
            <div v-else-if="users.length === 0" class="no-users">No users found.</div>

            <div v-else class="table-container">
              <table class="user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.fullName }}</td>
                    <td>{{ user.phoneNumber }}</td>
                    <td>{{ user.email }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';
import SideBar from '@/components/SideBar.vue';

export default {
  name: 'AdminUsers',
  components: {
    SideBar
  },
  data() {
    return {
      users: [],
      loading: true
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      axios.get('http://192.168.1.19:8086/api/admin/getAllUsers')
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        })
        .finally(() => {
          this.loading = false;
        });
    }
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

.v-application {
  background: linear-gradient(135deg, var(--cream) 0%, #F5F0EA 50%, var(--cream) 100%);
  position: relative;
}

.flex-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  position: relative;
  z-index: 1; /* Ensure content is above floating shapes */
}

.floating-elements {
  position: fixed; /* Changed to fixed to cover entire viewport */
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 0; /* Below main content */
  pointer-events: none; /* Prevent interaction with shapes */
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(147, 111, 90, 0.12), rgba(145, 73, 52, 0.06));
  animation: float 25s infinite ease-in-out;
}

.floating-shape.shape-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -150px;
  animation-delay: 0s;
}

.floating-shape.shape-2 {
  width: 350px;
  height: 350px;
  bottom: -100px;
  right: -150px;
  animation-delay: -8s;
}

.floating-shape.shape-3 {
  width: 250px;
  height: 250px;
  top: 20%;
  right: 10%;
  animation-delay: -16s;
}

.floating-shape.shape-4 {
  width: 180px;
  height: 180px;
  bottom: 25%;
  left: 10%;
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

.sidebar {
  background: linear-gradient(180deg, var(--primary-brown) 0%, var(--secondary-brown) 100%);
  color: var(--white);
}

.main-content {
  background: transparent;
  flex-grow: 1;
  position: relative;
  z-index: 2; /* Above floating shapes */
  padding-left: 32px; /* Shift content right to clear sidebar */
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  color: var(--text-dark);
  font-weight: 600;
  font-size: 2rem;
  margin: 16px 0;
  text-shadow: 0 2px 8px var(--shadow-light);
  text-align: center;
}

.loading,
.no-users {
  font-family: 'Inter', sans-serif;
  color: var(--text-medium);
  font-weight: 500;
  font-size: 1.2rem;
  text-align: center;
  padding: 24px;
  background: var(--white);
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--shadow-medium), 0 2px 8px var(--shadow-light);
}

.table-container {
  background: var(--white);
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--shadow-medium), 0 2px 8px var(--shadow-light);
  overflow-x: auto;
  padding: 24px;
}

.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 600px;
}

.user-table th,
.user-table td {
  padding: 16px;
  text-align: left;
  font-family: 'Inter', sans-serif;
  color: var(--text-dark);
  font-size: 0.95rem;
  border-bottom: 1px solid #E8DDD4;
}

.user-table th {
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 3; /* Above table rows */
}

.user-table th:first-child {
  border-top-left-radius: 12px;
}

.user-table th:last-child {
  border-top-right-radius: 12px;
}

.user-table tr {
  transition: background-color 0.3s ease;
}

.user-table tr:hover {
  background-color: #FEFDFB;
}

.user-table td {
  color: var(--text-medium);
  font-weight: 500;
}

/* Responsive Styles */
@media (max-width: 599px) {
  .flex-container {
    flex-direction: column;
    height: auto;
  }

  .sidebar {
    order: 2;
    min-height: auto;
    position: relative;
  }

  .main-content {
    order: 1;
    padding: 8px;
    padding-left: 16px;
  }

  .content-container {
    padding: 8px;
  }

  .page-title {
    font-size: 1.5rem;
    margin: 12px 0 20px 0;
  }

  .loading,
  .no-users {
    font-size: 1rem;
    padding: 16px;
  }

  .table-container {
    padding: 16px;
  }

  .user-table {
    font-size: 0.85rem;
    min-width: unset;
  }

  .user-table th,
  .user-table td {
    padding: 10px;
  }

  .floating-shape {
    display: none; /* Hide shapes on small screens */
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .page-title {
    font-size: 1.75rem;
  }

  .main-content {
    padding-left: 24px;
  }

  .content-container {
    padding: 12px;
  }

  .user-table {
    font-size: 0.9rem;
  }

  .user-table th,
  .user-table td {
    padding: 12px;
  }
}

@media (min-width: 960px) and (max-width: 1263px) {
  .page-title {
    font-size: 1.9rem;
  }

  .main-content {
    padding-left: 28px;
  }

  .content-container {
    padding: 14px;
  }
}

@media (min-width: 1264px) and (max-width: 1903px) {
  .page-title {
    font-size: 2rem;
  }

  .main-content {
    padding-left: 32px;
  }

  .content-container {
    padding: 16px;
  }
}

@media (min-width: 1904px) {
  .page-title {
    font-size: 2.2rem;
  }

  .main-content {
    padding-left: 40px;
  }

  .content-container {
    padding: 20px;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .flex-container {
    height: auto;
    min-height: 100vh;
  }

  .main-content {
    padding-left: 24px;
  }

  .user-table th,
  .user-table td {
    padding: 8px;
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .table-container {
    box-shadow: 0 8px 32px var(--shadow-light), 0 2px 8px var(--shadow-light);
  }
}

@media print {
  .sidebar {
    display: none;
  }

  .main-content {
    width: 100% !important;
    max-width: 100% !important;
    flex: none !important;
    padding-left: 16px;
  }

  .table-container {
    box-shadow: none !important;
    border: 1px solid #E8DDD4;
  }

  .floating-elements {
    display: none;
  }
}

@media (hover: none) and (pointer: coarse) {
  .user-table tr:hover {
    background-color: transparent;
  }

  .user-table tr:active {
    background-color: #FEFDFB;
  }
}

@media (prefers-reduced-motion: reduce) {
  .user-table tr {
    transition: none;
  }

  .floating-shape {
    animation: none;
  }
}

@media (prefers-color-scheme: dark) {
  .main-content {
    background: transparent;
  }

  .page-title {
    color: var(--text-dark);
  }

  .table-container {
    background: var(--white);
    border-color: #E8DDD4;
  }

  .loading,
  .no-users {
    background: var(--white);
    color: var(--text-medium);
  }

  .user-table th {
    background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
    color: var(--white);
  }

  .user-table td {
    color: var(--text-medium);
  }
}
</style>