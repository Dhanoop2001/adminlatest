<template>
  <div class="admin-panel-container">
    <!-- Background animated elements -->
    <div class="animated-shapes">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="circle circle-4"></div>
    </div>

    <!-- Sidebar Menu -->
    <div class="sidebar">
      <div class="brand-logo">
        <span class="logo-icon"><i class="fas fa-spa"></i></span>
        <h2 class="brand-name">SalonInfo</h2>
      </div>
      
      <div class="menu">
        <div class="menu-item active">
          <i class="icon dashboard-icon">◙</i>
          <span>Dashboard</span>
        </div>
        <div class="menu-item" @click="navigateToAdminPanel">
          <i class="icon parlour-icon">✂</i>
          <span>Admin Panel</span>
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

    <div class="main-content">
      <div class="panel-content">
        <!-- Header -->
        <div class="panel-header">
          <h1 class="page-title">Admin <span>Approval</span></h1>
        </div>
        
        <!-- Tabs -->
        <div class="tabs-container">
          <button 
            @click="tab = 'pending'" 
            :class="['tab-button', { active: tab === 'pending' }]"
          >
            <i class="fas fa-clock"></i> Pending Requests
          </button>
          <button 
            @click="tab = 'approved'" 
            :class="['tab-button', { active: tab === 'approved' }]"
          >
            <i class="fas fa-check-circle"></i> Approved Requests
          </button>
        </div>
        
        <!-- Loading Indicator -->
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
        </div>
        
        <!-- Parlours Table -->
        <div v-else class="table-container">
          <div class="table-header">
            <span v-for="header in headers" :key="header.value" class="table-header-cell">
              {{ header.text }}
            </span>
          </div>
          
          <div class="table-body">
            <div v-if="(tab === 'pending' ? pendingParlours : approvedParlours).length === 0" class="empty-state">
              <i class="fas fa-folder-open"></i>
              <p>No {{ tab }} parlours found</p>
            </div>
            
            <div 
              v-for="item in (tab === 'pending' ? pendingParlours : approvedParlours)" 
              :key="item.id" 
              class="table-row"
            >
              <span class="table-cell">{{ item.sl_no }}</span>
              <span class="table-cell">{{ item.id }}</span>
              <span class="table-cell">{{ item.parlourName }}</span>
              <span class="table-cell">
                <a href="#" @click.prevent="openLicensePopup(item.licenseNumber, item.licenseImage)">
                  {{ item.licenseNumber }}
                </a>
              </span>
              <span class="table-cell">{{ item.phoneNumber || 'N/A' }}</span>
              <span class="table-cell email">{{ item.email }}</span>
              <span class="table-cell">{{ item.location }}</span>
              <span class="table-cell lat">{{ item.latitude }}</span>
              <span class="table-cell longitude">{{ item.longitude }}</span>
              <span class="table-cell description">{{ item.description }}</span>
              <span class="table-cell actions">
                <button 
                  v-if="tab === 'pending'" 
                  class="action-button approve" 
                  @click="openApproveDialog(item.id)"
                  title="Approve"
                >
                  <i class="fas fa-check"></i>
                </button>
                <button 
                  class="action-button decline" 
                  @click="openDeclineDialog(item.id)"
                  title="Decline"
                >
                  <i class="fas fa-times"></i> <!-- Decline icon -->
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve Confirmation Dialog -->
    <div v-if="approveDialog" class="dialog-backdrop">
      <div class="dialog-card">
        <div class="dialog-header">
          <h3><i class="fas fa-check-circle"></i> Confirm Approval</h3>
        </div>
        <div class="dialog-body">
          <p>Are you sure you want to approve this parlour?</p>
        </div>
        <div class="dialog-footer">
          <button class="dialog-button cancel" @click="approveDialog = false">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button class="dialog-button confirm" @click="confirmApprove(selectedParlourId)">
            <i class="fas fa-check"></i> Approve
          </button>
        </div>
      </div>
    </div>

    <!-- Decline Confirmation Dialog -->
    <div v-if="declineDialog" class="dialog-backdrop">
      <div class="dialog-card">
        <div class="dialog-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Confirm Decline</h3>
        </div>
        <div class="dialog-body">
          <p>Are you sure you want to decline this parlour?</p>
        </div>
        <div class="dialog-footer">
          <button class="dialog-button cancel" @click="declineDialog = false">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button class="dialog-button confirm" @click="confirmDecline(selectedParlourId)">
            <i class="fas fa-check"></i> Decline
          </button>
        </div>
      </div>
    </div>

    <!-- License Popup -->
    <div v-if="licensePopup" class="popup-backdrop">
      <div class="popup-card">
        <div class="popup-header">
          <h3>License Information</h3>
          <button class="close-button" @click="licensePopup = false">✖</button>
        </div>
        <div class="popup-body">
          <p><strong>License Number:</strong> {{ selectedLicenseNumber }}</p>
          <img :src="selectedImageUrl" alt="License Image" class="license-image" v-if="selectedImageUrl" />
          <p v-else>No image available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tab: "pending",
      loading: false,
      parlours: [],
      approveDialog: false,
      declineDialog: false, // Added decline dialog
      licensePopup: false,
      selectedLicenseNumber: null,
      selectedImageUrl: null,
      selectedParlourId: null,
      headers: [
        { text: "S.No", value: "sl_no" },
        { text: "ID", value: "id" },
        { text: "Parlour Name", value: "parlourName" },
        { text: "License", value: "licenseNumber" },
        { text: "Phone", value: "phone" },
        { text: "Email", value: "email" },
        { text: "Location", value: "location" },
        { text: "Latitude", value: "latitude" },
        { text: "Longitude", value: "longitude" },
        { text: "Description", value: "description" },
        { text: "Actions", value: "actions" }
      ],
      token: null,
    };
  },
  computed: {
    pendingParlours() {
      return this.parlours.filter(p => p.status === 0);
    },
    approvedParlours() {
      return this.parlours.filter(p => p.status === 1);
    }
  },
  methods: {
    async fetchParlours() {
      this.loading = true;
      try {
        const response = await axios.get("http://192.168.1.14:8086/api/admin/allRegisteredParlour", {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        this.parlours = response.data.map((p, index) => ({
          sl_no: index + 1, // Adjusted to start from 1
          id: p.id,
          parlourName: p.parlourName,
          licenseNumber: p.licenseNumber,
          phoneNumber: p.phoneNumber || 'N/A',
          email: p.email,
          location: p.location,
          latitude: p.latitude,
          longitude: p.longitude,
          description: p.description,
          licenseImage: p.licenseImage, // Expecting Base64 string or binary data
          status: p.status
        }));
      } catch (error) {
        console.error("Error fetching parlours:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
        }
      } finally {
        this.loading = false;
      }
    },
    navigateToAdminPanel() {
      this.$router.push({ name: 'AdminPanel' });
    },
    openApproveDialog(id) {
      this.selectedParlourId = id;
      this.approveDialog = true;
    },
    async confirmApprove(id) {
      if (!id) return;
      try {
        await axios.put(
          `http://192.168.1.14:8086/api/admin/approve?id=${id}&status=1`,
          {},
          { headers: { 'Authorization': `Bearer ${this.token}` } }
        );
        this.fetchParlours();
        this.approveDialog = false;
      } catch (error) {
        console.error("Error approving parlour:", error);
      }
    },
    openDeclineDialog(id) {
      this.selectedParlourId = id;
      this.declineDialog = true;
    },
    async confirmDecline(id) {
      if (!id) return;
      try {
        await axios.delete(
          `http://192.168.1.14:8086/api/admin/parlour/delete?id=${id}`, // Adjust the endpoint as necessary
          
          { headers: { 'Authorization': `Bearer ${this.token}` } }
        );
        this.fetchParlours();
        this.declineDialog = false; // Close the dialog after confirming
      } catch (error) {
        console.error("Error declining parlour:", error);
      }
    },
    openLicensePopup(licenseNumber, licenseImage) {
      this.selectedLicenseNumber = licenseNumber;
      
      // Handle the licenseImage
      if (licenseImage) {
        if (licenseImage.startsWith('data:image/')) {
          // If it's already a Base64 string with a data URI prefix
          this.selectedImageUrl = licenseImage;
        } else {
          // If it's a plain Base64 string or binary data, assume it's JPEG and add the prefix
          try {
            const base64String = typeof licenseImage === 'string' ? licenseImage : this.binaryToBase64(licenseImage);
            this.selectedImageUrl = `data:image/jpeg;base64,${base64String}`;
          } catch (error) {
            console.error("Error converting license image to Base64:", error);
            this.selectedImageUrl = null;
          }
        }
      } else {
        this.selectedImageUrl = null;
      }
      
      this.licensePopup = true;
    },
    binaryToBase64(binaryData) {
      // Convert binary data to Base64
      const binaryArray = new Uint8Array(binaryData);
      let binaryString = '';
      for (let i = 0; i < binaryArray.length; i++) {
        binaryString += String.fromCharCode(binaryArray[i]);
      }
      return btoa(binaryString);
    },
    logout() {
      sessionStorage.removeItem('admin_token');
      this.$router.push({ name: 'Login' }); // Adjust the route name as per your router configuration
    }
  },
  mounted() {
    this.token = sessionStorage.getItem('admin_token');
    if (this.token) {
      this.fetchParlours();
    } else {
      this.$router.push({ name: 'Login' }); // Redirect to login if no token
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-panel-container {
  min-height: 100vh;
  width: 100%;
  font-family: 'Montserrat', sans-serif;
  background-color: #0a2463;
  position: relative;
  overflow: hidden;
  display: flex;
}

.animated-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  animation: float 15s infinite ease-in-out;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -50px;
  left: -100px;
  background: linear-gradient(145deg, rgba(65, 88, 208, 0.2) 0%, rgba(64, 112, 208, 0.08) 100%);
  animation-delay: 0s;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -150px;
  right: -100px;
  background: linear-gradient(145deg, rgba(25, 175, 208, 0.15) 0%, rgba(25, 145, 208, 0.05) 100%);
  animation-delay: -5s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 30%;
  right: 15%;
  background: linear-gradient(145deg, rgba(80, 120, 208, 0.12) 0%, rgba(60, 90, 208, 0.04) 100%);
  animation-delay: -10s;
}

.circle-4 {
  width: 150px;
  height: 150px;
  bottom: 25%;
  left: 10%;
  background: linear-gradient(145deg, rgba(120, 150, 208, 0.12) 0%, rgba(100, 130, 208, 0.05) 100%);
  animation-delay: -15s;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-30px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0);
  }
}

/* Sidebar styles */
.sidebar {
  width: 280px;
  background: linear-gradient(to bottom, #1e3c72, #2a5298);
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
}

.sidebar .brand-logo {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  margin-bottom: 3rem;
}

.sidebar .brand-logo .logo-icon {
  background: white;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-right: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.sidebar .brand-logo .logo-icon i {
  font-size: 24px;
  color: #1e3c72;
}

.sidebar .brand-logo .brand-name {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.menu {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.menu-item .icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 1rem;
}

.menu-item span {
  font-size: 1rem;
  font-weight: 500;
}

.menu-item.logout {
  margin-top: auto;
  color: #ff6b6b;
}

.menu-item.logout:hover {
  background: rgba(255, 107, 107, 0.2);
}

/* Main content area */
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  height: 100vh;
}

/* Panel content */
.panel-content {
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.panel-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.page-title span {
  font-weight: 300;
  color: #1e50e2;
}

/* Tabs styling */
.tabs-container {
  display: flex;
  margin-bottom: 2rem;
  background: #f9fafc;
  border-radius: 15px;
  padding: 8px;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  text-align: center;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #777;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.tab-button i {
  margin-right: 10px;
}

.tab-button.active {
  background: linear-gradient(to right, #1e50e2, #0a2463);
  color: white;
  box-shadow: 0 4px 15px rgba(30, 80, 226, 0.2);
}

/* Loading indicator */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(30, 80, 226, 0.2);
  border-top: 4px solid #1e50e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Table styling */
.table-container {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 100px repeat(5, 1fr) 120px 120px 1.5fr 1fr;
  background: linear-gradient(to right, #1e50e2, #0a2463);
  color: white;
  font-weight: 600;
  padding: 1rem 0.5rem;
  font-size: 0.9rem;
  align-items: center;
}

.table-header-cell {
  padding: 0.75rem;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-body {
  max-height: 500px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 100px repeat(5, 1fr) 120px 120px 1.5fr 1fr;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  align-items: center;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.table-cell {
  padding: 1rem 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  line-height: 1.4;
  display: flex;
  align-items: center;
  height: 100%;
}

.table-cell.email {
  word-break: break-all;
  white-space: normal;
}

.table-cell.description {
  white-space: normal;
  line-height: 1.5;
  max-height: 100px;
  overflow-y: auto;
}

.table-cell.actions {
  display: flex;
  gap: 15px; /* Adjust the gap between buttons */
  justify-content: flex-start;
}

.action-button {
  display: inline-flex;
  border: none;
  border-radius: 20px; /* Rounded corners for elliptical shape */
  padding: 0.5rem 1rem; /* Add padding for a more elongated shape */
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Add shadow for depth */
}

.action-button.approve {
  background: linear-gradient(to right, #36d1dc, #5b86e5); /* Gradient background */
  color: white;
}

.action-button.approve:hover {
  background: linear-gradient(to right, #32c3cd, #4e75d9); /* Darker gradient on hover */
  transform: translateY(-2px); /* Lift effect on hover */
}

.action-button.decline {
  background: linear-gradient(to right, #ff416c, #ff4b2b); /* Gradient background */
  color: white;
}

.action-button.decline:hover {
  background: linear-gradient(to right, #f13b63, #f44426); /* Darker gradient on hover */
  transform: translateY(-2px); /* Lift effect on hover */
}

/* Icon styles */
.action-button i {
  font-size: 1.2rem; /* Increase icon size */
  transition: transform 0.3s ease; /* Smooth transition for icon */
}

.action-button:hover i {
  transform: scale(1.1); /* Slightly enlarge icon on hover */
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #aaa;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.empty-state p {
  font-size: 1.2rem;
}

/* Dialog styling */
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); /* Darker backdrop for a more premium feel */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(10px); /* Added blur effect for depth */
}

.dialog-card {
  width: 450px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); /* Softer shadow for a premium look */
  animation: dialog-appear 0.3s ease;
  transition: transform 0.3s ease; /* Smooth scaling effect */
}

.dialog-card:hover {
  transform: scale(1.02); /* Slight scale on hover for interactivity */
}

.dialog-header {
  background: linear-gradient(to right, #1e50e2, #0a2463);
  color: white;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border for separation */
  gap: 12px;
}

.dialog-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.dialog-header h3 i {
  margin-right: 12px;
  font-size: 1.5rem;
}

.dialog-body {
  padding: 2rem 1.5rem;
  text-align: center;
  font-size: 1.1rem;
  color: #333; /* Darker text for better readability */
}

.dialog-footer {
  display: flex;
  justify-content: center;
  padding: 0 1.5rem 1.5rem;
  gap: 15px;
}

.dialog-button {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.dialog-button i {
  margin-right: 8px;
}

.dialog-button.cancel {
  background: #f1f3f5;
  color: #555;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}

.dialog-button.cancel:hover {
  background: #e9ecef;
}

.dialog-button.confirm {
  background: linear-gradient(to right, #36d1dc, #5b86e5);
  color: white;
  box-shadow: 0 2px 5px rgba(54, 209, 220, 0.3); /* Soft shadow for depth */
}

.dialog-button.confirm:hover {
  background: linear-gradient(to right, #32c3cd, #4e75d9);
  box-shadow: 0 4px 10px rgba(91, 134, 229, 0.3);
}

/* License Popup styling */
.popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(10px); /* Added blur effect for depth */
}

.popup-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 400px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); /* Softer shadow for a premium look */
  transition: transform 0.3s ease; /* Smooth scaling effect */
}

.popup-card:hover {
  transform: scale(1.02); /* Slight scale on hover for interactivity */
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-body {
  margin-top: 1rem;
  text-align: center;
  color: #333; /* Darker text for better readability */
}

.license-image {
  max-width: 100%;
  height: auto;
  margin-top: 1rem;
  border-radius: 10px; /* Rounded corners for the image */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}

.close-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #1e50e2; /* Color to match the theme */
  transition: color 0.3s;
}

.close-button:hover {
  color: #0a2463; /* Darker shade on hover */
}
</style>