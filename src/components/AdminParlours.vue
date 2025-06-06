<template>
  <div class="admin-panel-container">
    <SideBar />
    <!-- Background animated elements -->
    <div class="animated-shapes">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="circle circle-4"></div>
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
            <span class="table-header-cell">S.No</span>
            <span class="table-header-cell">ID</span>
            <span class="table-header-cell">Parlour Name</span>
            <span class="table-header-cell">License</span>
            <span class="table-header-cell">Phone</span>
            <span class="table-header-cell">Email</span>
            <span class="table-header-cell">Details</span>
            <span class="table-header-cell">Actions</span>
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
              <span class="table-cell view-details">
                <button class="action-button view" @click="openDetailsPopup(item)" title="View Details">
                  <i class="fas fa-eye"></i>
                </button>
              </span>
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
                  <i class="fas fa-times"></i>
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
          <button 
            class="dialog-button confirm" 
            @click="confirmDecline(selectedParlourId)"
            :disabled="isDeleting"
          >
            <i class="fas fa-check"></i> {{ isDeleting ? 'Declining...' : 'Decline' }}
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
    
    <!-- Details Popup -->
    <div v-if="detailsPopup" class="popup-backdrop">
      <div class="popup-card details-popup">
        <div class="popup-header">
          <h3><i class="fas fa-info-circle"></i> Parlour Details</h3>
          <button class="close-button" @click="detailsPopup = false">✖</button>
        </div>
        <div class="popup-body details-body">
          <div class="details-row">
            <div class="detail-label">Parlour Name:</div>
            <div class="detail-value">{{ selectedParlour.parlourName }}</div>
          </div>
          <div class="details-row">
            <div class="detail-label">ID:</div>
            <div class="detail-value">{{ selectedParlour.id }}</div>
          </div>
          <div class="details-row">
            <div class="detail-label">Location:</div>
            <div class="detail-value">{{ selectedParlour.location }}</div>
          </div>
          <div class="details-row">
            <div class="detail-label">Latitude:</div>
            <div class="detail-value">{{ selectedParlour.latitude }}</div>
          </div>
          <div class="details-row">
            <div class="detail-label">Longitude:</div>
            <div class="detail-value">{{ selectedParlour.longitude }}</div>
          </div>
          <div class="details-row">
            <div class="detail-label">License Number:</div>
            <div class="detail-value">{{ selectedParlour.licenseNumber }}</div>
          </div>
          <div class="details-row">
            <div class="detail-label">Email:</div>
            <div class="detail-value">{{ selectedParlour.email }}</div>
          </div>
          <div class="details-row">
            <div class="detail-label">Phone:</div>
            <div class="detail-value">{{ selectedParlour.phoneNumber || 'N/A' }}</div>
          </div>
          <div class="details-description">
            <div class="detail-label">Description:</div>
            <div class="detail-value description">{{ selectedParlour.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from './SideBar.vue';
import axios from "axios";

export default {
  name: 'AdminParlours',
  components: {
    SideBar
  },
  data() {
    return {
      tab: "pending",
      loading: false,
      pendingParloursData: [],
      approvedParloursData: [],
      approveDialog: false,
      declineDialog: false,
      licensePopup: false,
      detailsPopup: false,
      selectedLicenseNumber: null,
      selectedImageUrl: null,
      selectedParlourId: null,
      selectedParlour: {},
      token: null,
      isDeleting: false,
    };
  },

  computed: {
    pendingParlours() {
      return this.pendingParloursData;
    },
    approvedParlours() {
      return this.approvedParloursData;
    }
  },

  methods: {
    async fetchPendingParlours() {
      try {
        const response = await axios.get("http://192.168.1.19:8086/api/admin/allPendingParlour", {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        this.pendingParloursData = response.data.map((p, index) => ({
          sl_no: index + 1,
          id: p.id,
          parlourName: p.parlourName,
          licenseNumber: p.licenseNumber,
          phoneNumber: p.phoneNumber || 'N/A',
          email: p.email,
          location: p.location,
          latitude: p.latitude,
          longitude: p.longitude,
          description: p.description,
          licenseImage: p.licenseImage,
          status: p.status
        }));
      } catch (error) {
        console.error("Error fetching pending parlours:", error.response?.data || error.message);
        alert('Failed to fetch pending parlours. Please try again.');
      }
    },

    async fetchApprovedParlours() {
      try {
        const response = await axios.get("http://192.168.1.19:8086/api/admin/allRegisteredParlour", {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        this.approvedParloursData = response.data
          .filter(p => p.status === 1)
          .map((p, index) => ({
            sl_no: index + 1,
            id: p.id,
            parlourName: p.parlourName,
            licenseNumber: p.licenseNumber,
            phoneNumber: p.phoneNumber || 'N/A',
            email: p.email,
            location: p.location,
            latitude: p.latitude,
            longitude: p.longitude,
            description: p.description,
            licenseImage: p.licenseImage,
            status: p.status
          }));
      } catch (error) {
        console.error("Error fetching approved parlours:", error.response?.data || error.message);
        alert('Failed to fetch approved parlours. Please try again.');
      }
    },

    async fetchParlours() {
      this.loading = true;
      try {
        await Promise.all([this.fetchPendingParlours(), this.fetchApprovedParlours()]);
      } finally {
        this.loading = false;
      }
    },

    openDetailsPopup(parlour) {
      this.selectedParlour = parlour;
      this.detailsPopup = true;
    },

    openApproveDialog(id) {
      this.selectedParlourId = id;
      this.approveDialog = true;
    },

    async confirmApprove(id) {
      if (!id) return;
      try {
        await axios.put(
          `http://192.168.1.19:8086/api/admin/approve?id=${id}&status=1`,
          {},
          { headers: { 'Authorization': `Bearer ${this.token}` } }
        );
        await this.fetchParlours();
        this.approveDialog = false;
        alert('Parlour approved successfully');
      } catch (error) {
        console.error("Error approving parlour:", error.response?.data || error.message);
        alert('Failed to approve parlour. Please try again.');
      }
    },

    openDeclineDialog(id) {
      this.selectedParlourId = id;
      this.declineDialog = true;
    },

    async confirmDecline(id) {
      if (!id || this.isDeleting) return;
      this.isDeleting = true;
      console.log("Deleting parlour with ID:", id);
      console.log("Token:", this.token);
      try {
        await axios.delete(
          `http://192.168.1.19:8086/api/admin/parlour/delete?id=${id}`,
          { headers: { 'Authorization': `Bearer ${this.token}` } }
        );
        await this.fetchParlours();
        this.declineDialog = false;
        alert('Parlour declined successfully');
      } catch (error) {
        console.error("Error declining parlour:", error.response?.data || error.message);
        alert('Failed to decline parlour. Please try again.');
      } finally {
        this.isDeleting = false;
      }
    },

    openLicensePopup(licenseNumber, licenseImage) {
      this.selectedLicenseNumber = licenseNumber;

      if (licenseImage) {
        if (licenseImage.startsWith('data:image/')) {
          this.selectedImageUrl = licenseImage;
        } else {
          try {
            const base64String = typeof licenseImage === 'string'
              ? licenseImage
              : this.binaryToBase64(licenseImage);
            this.selectedImageUrl = `data:image/jpeg;base64,${base64String}`;
          } catch (error) {
            console.error("Error converting license image:", error);
            this.selectedImageUrl = null;
          }
        }
      } else {
        this.selectedImageUrl = null;
      }

      this.licensePopup = true;
    },

    binaryToBase64(binaryData) {
      const binaryArray = new Uint8Array(binaryData);
      let binaryString = '';
      for (let i = 0; i < binaryArray.length; i++) {
        binaryString += String.fromCharCode(binaryArray[i]);
      }
      return btoa(binaryString);
    },

    navigateToAdminPanel() {
      this.$router.push({ name: 'AdminPanel' });
    },

    logout() {
      sessionStorage.removeItem('admin_token');
      this.$router.push({ name: 'Login' });
    }
  },

  mounted() {
    this.token = sessionStorage.getItem('admin_token');
    if (this.token) {
      this.fetchParlours();
    } else {
      this.$router.push({ name: 'Login' });
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

.admin-panel-container {
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, var(--cream) 0%, #F5F0EA 50%, var(--cream) 100%);
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
  background: linear-gradient(135deg, rgba(147, 111, 90, 0.12), rgba(145, 73, 52, 0.06));
  animation: float 25s infinite ease-in-out;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -50px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -150px;
  right: -100px;
  animation-delay: -5s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 30%;
  right: 15%;
  animation-delay: -10s;
}

.circle-4 {
  width: 150px;
  height: 150px;
  bottom: 25%;
  left: 10%;
  animation-delay: -15s;
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

/* Sidebar styles */
.sidebar {
  width: 260px;
  min-width: 260px;
  background: linear-gradient(180deg, var(--primary-brown) 0%, var(--secondary-brown) 100%);
  height: 100vh;
  position: sticky;
  display: flex;
  top: 0;
  left: 0;
  z-index: 10;
  flex-direction: column;
}

.sidebar .brand-logo {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  margin-bottom: 3rem;
}

.sidebar .brand-logo .logo-icon {
  background: var(--white);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-right: 1rem;
  box-shadow: 0 4px 10px var(--shadow-light);
}

.sidebar .brand-logo .logo-icon i {
  font-size: 24px;
  color: var(--dark-brown);
}

.sidebar .brand-logo .brand-name {
  color: var(--white);
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
  color: var(--error);
}

.menu-item.logout:hover {
  background: rgba(211, 47, 47, 0.2);
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
  background: var(--white);
  border-radius: 20px;
  box-shadow: 
    0 25px 50px -12px var(--shadow-heavy),
    0 10px 20px -5px var(--shadow-medium);
  position: relative;
  z-index: 1;
}

.panel-header {
  margin-bottom: 2rem;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-dark);
}

.page-title span {
  font-weight: 300;
  color: var(--primary-brown);
}

/* Tabs styling */
.tabs-container {
  display: flex;
  margin-bottom: 2rem;
  background: #FEFDFB;
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
  color: var(--text-medium);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.tab-button i {
  margin-right: 10px;
}

.tab-button.active {
  background: linear-gradient(to right, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
  box-shadow: 0 4px 15px var(--shadow-medium);
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
  border: 4px solid rgba(147, 111, 90, 0.2);
  border-top: 4px solid var(--primary-brown);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Table styling */
.table-container {
  background: var(--white);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px var(--shadow-light);
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 100px 1fr 1fr 1fr 1fr 80px 160px;
  background: linear-gradient(to right, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
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
  grid-template-columns: 80px 100px 1fr 1fr 1fr 1fr 80px 160px;
  border-bottom: 1px solid #E8DDD4;
  transition: background-color 0.2s;
  align-items: center;
}

.table-row:hover {
  background-color: #FEFDFB;
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

.table-cell.actions {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
}

.table-cell.view-details {
  display: flex;
  justify-content: center;
}

.action-button {
  display: inline-flex;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px var(--shadow-medium);
}

.action-button.view {
  background: linear-gradient(to right, var(--light-brown), var(--primary-brown));
  color: var(--white);
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button.view:hover {
  background: linear-gradient(to right, var(--primary-brown), var(--dark-brown));
  transform: translateY(-2px);
}

.action-button.approve {
  background: linear-gradient(to right, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
}

.action-button.approve:hover {
  background: linear-gradient(to right, var(--dark-brown), var(--secondary-brown));
  transform: translateY(-2px);
}

.action-button.decline {
  background: linear-gradient(to right, var(--error), #C62828);
  color: var(--white);
}

.action-button.decline:hover {
  background: linear-gradient(to right, #C62828, var(--error));
  transform: translateY(-2px);
}

/* Icon styles */
.action-button i {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.action-button:hover i {
  transform: scale(1.1);
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--text-light);
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
  background: rgba(44, 24, 16, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.dialog-card {
  width: 450px;
  background: var(--white);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px var(--shadow-heavy);
  animation: dialog-appear 0.3s ease;
  transition: transform 0.3s ease;
}

.dialog-card:hover {
  transform: scale(1.02);
}

.dialog-header {
  background: linear-gradient(to right, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  color: var(--text-dark);
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

.dialog-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dialog-button i {
  margin-right: 8px;
}

.dialog-button.cancel {
  background: #E8DDD4;
  color: var(--text-medium);
  box-shadow: 0 2px 5px var(--shadow-light);
}

.dialog-button.cancel:hover {
  background: #F5F0EA;
}

.dialog-button.confirm {
  background: linear-gradient(to right, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
  box-shadow: 0 2px 5px var(--shadow-medium);
}

.dialog-button.confirm:hover {
  background: linear-gradient(to right, var(--dark-brown), var(--secondary-brown));
  box-shadow: 0 4px 10px var(--shadow-medium);
}

/* License Popup styling */
.popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(44, 24, 16, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(10px);
}

.popup-card {
  background: var(--white);
  border-radius: 20px;
  padding: 2rem;
  width: 400px;
  box-shadow: 0 15px 30px var(--shadow-heavy);
  animation: popup-appear 0.3s ease;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-card.details-popup {
  width: 600px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E8DDD4;
}

.popup-header h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-dark);
  display: flex;
  align-items: center;
}

.popup-header h3 i {
  margin-right: 10px;
  color: var(--primary-brown);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
  transition: all 0.2s;
}

.close-button:hover {
  color: var(--text-dark);
  transform: scale(1.1);
}

.popup-body {
  padding: 1rem 0;
}

.license-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 10px;
  margin-top: 1rem;
  box-shadow: 0 5px 15px var(--shadow-light);
}

/* Details popup styling */
.details-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.details-row {
  display: flex;
  border-bottom: 1px solid #E8DDD4;
  padding-bottom: 10px;
}

.detail-label {
  width: 150px;
  font-weight: 600;
  color: var(--text-medium);
}

.detail-value {
  flex: 1;
  color: var(--text-dark);
}

.details-description {
  display: flex;
  flex-direction: column;
  margin-top: 15px;
}

.detail-value.description {
  margin-top: 10px;
  background: #FEFDFB;
  padding: 15px;
  border-radius: 10px;
  line-height: 1.6;
}

/* Animation keyframes */
@keyframes dialog-appear {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popup-appear {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 1200px) {
  .table-header, .table-row {
    grid-template-columns: 60px 80px 1fr 1fr 1fr 1fr 60px 120px;
  }
  
  .action-button {
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 992px) {
  .admin-panel-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    flex-direction: row;
    padding: 1rem;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .sidebar .brand-logo {
    margin-bottom: 0;
  }
  
  .menu {
    flex-direction: row;
    justify-content: flex-end;
    margin-left: auto;
  }
  
  .menu-item {
    margin-bottom: 0;
    padding: 0.5rem 1rem;
  }
  
  .menu-item .icon {
    margin-right: 0.5rem;
  }
  
  .main-content {
    height: auto;
    padding: 1rem;
  }
  
  .panel-content {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .table-header, .table-row {
    grid-template-columns: 60px 1fr 1fr 80px 100px;
  }
  
  .table-header-cell:nth-child(2),
  .table-cell:nth-child(2),
  .table-header-cell:nth-child(5),
  .table-cell:nth-child(5),
  .table-header-cell:nth-child(6),
  .table-cell:nth-child(6) {
    display: none;
  }
  
  .popup-card {
    width: 90%;
  }
  .popup-card.details-popup {
    width: 90%;
  }
}

@media (max-width: 576px) {
  .table-header, .table-row {
    grid-template-columns: 1fr 1fr 80px;
  }
  
  .table-header-cell:nth-child(1),
  .table-cell:nth-child(1),
  .table-header-cell:nth-child(4),
  .table-cell:nth-child(4) {
    display: none;
  }
  
  .panel-header {
    margin-bottom: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .tabs-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .tab-button {
    width: 100%;
  }
}
</style>