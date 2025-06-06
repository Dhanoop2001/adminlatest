<template>
  <div class="admin-panel">
    <SideBar />

    <div class="admin-panel-container">
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
                <span class="table-cell">
                  <button class="icon-button" @click="openDetailsPopup(item)" title="View Details">
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

      <!-- Details Popup -->
      <div v-if="detailsPopup" class="popup-backdrop">
        <div class="popup-card details-popup">
          <div class="popup-header">
            <h3><i class="fas fa-info-circle"></i> Parlour Details</h3>
            <button class="close-button" @click="detailsPopup = false">✖</button>
          </div>
          <div class="popup-body details-body">
            <div v-if="selectedParlour" class="details-content">
              <div class="detail-row">
                <div class="detail-label">ID:</div>
                <div class="detail-value">{{ selectedParlour.id }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Parlour Name:</div>
                <div class="detail-value">{{ selectedParlour.parlourName }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">License Number:</div>
                <div class="detail-value">{{ selectedParlour.licenseNumber }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Phone:</div>
                <div class="detail-value">{{ selectedParlour.phoneNumber || 'N/A' }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Email:</div>
                <div class="detail-value">{{ selectedParlour.email }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Location:</div>
                <div class="detail-value">{{ selectedParlour.location }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Latitude:</div>
                <div class="detail-value">{{ selectedParlour.latitude }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Longitude:</div>
                <div class="detail-value">{{ selectedParlour.longitude }}</div>
              </div>
              <div class="detail-row description-row">
                <div class="detail-label">Description:</div>
                <div class="detail-value description">{{ selectedParlour.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SideBar from '@/components/SideBar.vue';

export default {
  components: {
    SideBar
  },
  data() {
    return {
      tab: "pending",
      loading: false,
      parlours: [],
      approvedParlours: [],
      approveDialog: false,
      declineDialog: false,
      licensePopup: false,
      detailsPopup: false,
      selectedLicenseNumber: null,
      selectedImageUrl: null,
      selectedParlourId: null,
      selectedParlour: null,
      token: null,
    };
  },
  computed: {
    pendingParlours() {
      return this.parlours.filter(p => p.status === 0);
    }
  },
  methods: {
    async fetchParlours() {
      this.loading = true;
      try {
        // Fetch pending parlours
        const pendingResponse = await axios.get("http://192.168.1.2:8086/api/admin/allPendingParlour", {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        this.parlours = pendingResponse.data.map((p, index) => ({
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

        // Fetch approved parlours
        const approvedResponse = await axios.get("http://192.168.1.2:8086/api/admin/allRegisteredParlour", {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        this.approvedParlours = approvedResponse.data.map((p, index) => ({
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
        console.error("Error fetching parlours:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
        }
      } finally {
        this.loading = false;
      }
    },
    openApproveDialog(id) {
      this.selectedParlourId = id;
      this.approveDialog = true;
    },
    async confirmApprove(id) {
      if (!id) return;
      try {
        await axios.put(
          `http://192.168.1.2:8086/api/admin/approve?id=${id}&status=1`,
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
          `http://192.168.1.2:8086/api/admin/parlour/delete?id=${id}`,
          { headers: { 'Authorization': `Bearer ${this.token}` } }
        );
        this.fetchParlours();
        this.declineDialog = false;
      } catch (error) {
        console.error("Error declining parlour:", error);
      }
    },
    openLicensePopup(licenseNumber, licenseImage) {
      this.selectedLicenseNumber = licenseNumber;
      if (licenseImage) {
        if (licenseImage.startsWith('data:image/')) {
          this.selectedImageUrl = licenseImage;
        } else {
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
    openDetailsPopup(parlour) {
      this.selectedParlour = parlour;
      this.detailsPopup = true;
    },
    binaryToBase64(binaryData) {
      const binaryArray = new Uint8Array(binaryData);
      let binaryString = '';
      for (let i = 0; i < binaryArray.length; i++) {
        binaryString += String.fromCharCode(binaryArray[i]);
      }
      return btoa(binaryString);
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-panel {
  display: flex;
  min-height: 100vh;
  font-family: 'Montserrat', sans-serif;
}

.admin-panel-container {
  flex-grow: 1;
  min-height: 100vh;
  width: 100%;
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

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  height: 100vh;
}

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

.table-container {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 100px 1fr 1fr 1fr 1fr 100px 140px;
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
  grid-template-columns: 80px 100px 1fr 1fr 1fr 1fr 100px 140px;
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

.table-cell.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
}

.action-button {
  display: inline-flex;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.action-button.approve {
  background: linear-gradient(to right, #36d1dc, #5b86e5);
  color: white;
}

.action-button.approve:hover {
  background: linear-gradient(to right, #32c3cd, #4e75d9);
  transform: translateY(-2px);
}

.action-button.decline {
  background: linear-gradient(to right, #ff416c, #ff4b2b);
  color: white;
}

.action-button.decline:hover {
  background: linear-gradient(to right, #f13b63, #f44426);
  transform: translateY(-2px);
}

.action-button i {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.action-button:hover i {
  transform: scale(1.1);
}

.icon-button {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: white;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(58, 123, 213, 0.3);
}

.icon-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(58, 123, 213, 0.4);
}

.icon-button i {
  font-size: 1.1rem;
}

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

.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.dialog-card {
  width: 450px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  animation: dialog-appear 0.3s ease;
  transition: transform 0.3s ease;
}

@keyframes dialog-appear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dialog-card:hover {
  transform: scale(1.02);
}

.dialog-header {
  background: linear-gradient(to right, #1e50e2, #0a2463);
  color: white;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  color: #333;
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.dialog-button.cancel:hover {
  background: #e9ecef;
}

.dialog-button.confirm {
  background: linear-gradient(to right, #36d1dc, #5b86e5);
  color: white;
  box-shadow: 0 2px 5px rgba(54, 209, 220, 0.3);
}

.dialog-button.confirm:hover {
  background: linear-gradient(to right, #32c3cd, #4e75d9);
  box-shadow: 0 4px 10px rgba(91, 134, 229, 0.3);
}

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
  backdrop-filter: blur(10px);
}

.popup-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 400px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.popup-card:hover {
  transform: scale(1.02);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-body {
  margin-top: 1rem;
  text-align: center;
  color: #333;
}

.license-image {
  max-width: 100%;
  height: auto;
  margin-top: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.close-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #1e50e2;
  transition: color 0.3s;
}

.close-button:hover {
  color: #0a2463;
}

/* Details popup specific styles */
.details-popup {
  width: 600px;
  max-width: 90vw;
}

.details-body {
  text-align: left;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.detail-label {
  width: 150px;
  font-weight: 600;
  color: #555;
}

.detail-value {
  flex: 1;
  color: #333;
}

.description-row {
  flex-direction: column;
  gap: 0.5rem;
}

.detail-value.description {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  max-height: 150px;
  overflow-y: auto;
  line-height: 1.6;
}

@media (max-width: 1200px) {
  .table-header, .table-row {
    grid-template-columns: 60px 80px 1fr 1fr 1fr 1fr 80px 100px;
  }
}

@media (max-width: 768px) {
  .table-header, .table-row {
    grid-template-columns: 60px 80px 1fr 1fr 100px;
  }
  
  .table-header-cell:nth-child(5),
  .table-header-cell:nth-child(6),
  .table-cell:nth-child(5),
  .table-cell:nth-child(6) {
    display: none;
  }
  
  .panel-content {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .tab-button {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  .action-button {
    padding: 0.4rem 0.8rem;
  }
  
  .dialog-card, .popup-card {
    width: 90%;
    max-width: 400px;
  }
}

@media (max-width: 576px) {
  .table-header, .table-row {
    grid-template-columns: 60px 1fr 80px 100px;
  }
  
  .table-header-cell:nth-child(2),
  .table-cell:nth-child(2),
  .table-header-cell:nth-child(4),
  .table-cell:nth-child(4) {
    display: none;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .panel-header {
    margin-bottom: 1.5rem;
  }
  
  .tabs-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .tab-button {
    border-radius: 8px;
  }
  
  .dialog-footer {
    flex-direction: column;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .detail-label {
    width: 100%;
  }
}

/* Add some smooth transitions for better UX */
.table-row, .table-cell, .tab-button, .action-button, .icon-button {
  transition: all 0.3s ease;
}

/* Enhanced hover states */
.table-row:hover {
  background-color: #f0f5ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(30, 80, 226, 0.1);
}

/* Better form inputs for future expansion */
input, select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.3s ease;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #1e50e2;
  box-shadow: 0 0 0 3px rgba(30, 80, 226, 0.1);
}

/* Improved scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Add subtle animations for popups */
@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.popup-card, .dialog-card {
  animation: scaleIn 0.3s ease-out forwards;
}

/* Pulsating notification for new items (future feature) */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(30, 80, 226, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(30, 80, 226, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(30, 80, 226, 0);
  }
}

.new-item {
  position: relative;
}

.new-item::after {
  content: '';
  position: absolute;
  top: 10px;
  right: 10px;
  width: 10px;
  height: 10px;
  background-color: #1e50e2;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

/* Improved loading animation */
@keyframes spin-glow {
  0% {
    transform: rotate(0deg);
    box-shadow: 0 0 5px rgba(30, 80, 226, 0.3);
  }
  50% {
    transform: rotate(180deg);
    box-shadow: 0 0 15px rgba(30, 80, 226, 0.6);
  }
  100% {
    transform: rotate(360deg);
    box-shadow: 0 0 5px rgba(30, 80, 226, 0.3);
  }
}

.spinner {
  animation: spin-glow 1.2s linear infinite;
}

/* Print styles for reports */
@media print {
  .admin-panel {
    display: block;
  }
  
  .tabs-container, .animated-shapes, .action-button, .icon-button {
    display: none !important;
  }
  
  .panel-content {
    padding: 0;
    box-shadow: none;
  }
  
  .table-row {
    page-break-inside: avoid;
    border-bottom: 1px solid #ddd;
  }
  
  .table-cell {
    color: #000;
  }
  
  .table-header {
    background: #eee !important;
    color: #000 !important;
  }
  
  body {
    background: white !important;
  }
}

/* Dark mode support (for future implementation) */
.dark-mode {
  --bg-color: #121212;
  --card-bg: #1e1e1e;
  --text-color: #f0f0f0;
  --border-color: #333;
  --highlight-color: #2f6bff;
}

.dark-mode .panel-content {
  background-color: var(--card-bg);
  color: var(--text-color);
}

.dark-mode .table-row {
  border-bottom: 1px solid var(--border-color);
}

.dark-mode .table-row:hover {
  background-color: #2a2a2a;
}

/* Accessibility improvements */
.icon-button:focus, .action-button:focus, .tab-button:focus {
  outline: 2px solid #4d90fe;
  outline-offset: 2px;
}

/* Skip to content for keyboard users */
.skip-to-content {
  position: absolute;
  left: -9999px;
  z-index: 999;
  padding: 1em;
  background-color: white;
  color: #0a2463;
  text-decoration: none;
}

.skip-to-content:focus {
  left: 50%;
  transform: translateX(-50%);
  top: 10px;
}
</style>