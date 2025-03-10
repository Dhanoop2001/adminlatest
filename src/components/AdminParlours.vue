<template>
  <div class="admin-panel">
    <div class="sidebar">
      <div class="logo-container">
        <h1 class="logo">SalonInfo</h1>
      </div>
      <div class="menu">
        <div class="menu-item" @click="$router.push('/admin-parlours')">
          <i class="icon parlour-icon">✂</i>
          <span>Admin Parlour</span>
        </div>
        <div class="menu-item active" @click="$router.push('/admin-panel')">
          <i class="icon dashboard-icon">◙</i>
          <span>Dashboard</span>
        </div>
        <div class="menu-item" @click="$router.push('/admin-offers')">
          <i class="icon offer-icon">🎁</i>
          <span>Offers</span>
        </div>
        <div class="menu-item" @click="$router.push('/admin-categories')">
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
      <div class="page-header">
        <h2>Admin Parlours</h2>
        <div class="date-display">{{ new Date().toLocaleDateString() }}</div>
      </div>

      <v-container>
        <v-card class="elevation-3 pa-3">
          <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4">
            <v-tab value="pending">Pending Requests</v-tab>
            <v-tab value="approved">Approved Requests</v-tab>
          </v-tabs>
        </v-card>

        <v-container v-if="loading" class="d-flex justify-center my-5">
          <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
        </v-container>

        <v-container v-else>
          <v-card class="elevation-2 pa-4">
            <v-data-table
              :headers="headers"
              :items="tab === 'pending' ? pendingParlours : approvedParlours"
              class="elevation-1"
            >
              <template #[`item.actions`]="{ item }">
                <v-btn v-if="tab === 'pending'" class="circular-btn" color="success" small @click="openApproveDialog(item.id)">
                  Approve
                </v-btn>
                <v-btn class="circular-btn" color="error" small @click="openDeleteDialog(item.id)">
                  Delete
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-container>
      </v-container>
    </div>
  
    <v-dialog v-model="approveDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Approval</v-card-title>
        <v-card-text>Are you sure you want to approve this parlour?</v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="approveDialog = false">Cancel</v-btn>
          <v-btn color="success" @click="confirmApprove">Approve</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this parlour?</v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminParlours",
  data() {
    return {
      tab: "pending",
      loading: false,
      parlours: [],
      approveDialog: false,
      deleteDialog: false,
      selectedParlourId: null,
      headers: [
        { text: "S.No", value: "sl_no" },
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "License", value: "licenseNumber" },
        { text: "Phone", value: "phone" },
        { text: "Email", value: "email" },
        { text: "Location", value: "location" },
        { text: "Latitude", value: "latitude" },
        { text: "Longitude", value: "longitude" },
        { text: "Description", value: "description" },
        { text: "Actions", value: "actions", sortable: false }
      ]
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
   
        const response = await axios.get("http://192.168.1.200:8086/api/admin/allRegisteredParlour", {
  
        });
        this.parlours = response.data.map((p, index) => ({
          sl_no: index +  1,
          id: p.id,
          name: p.name,
          licenseNumber: p.licenseNumber,
          phone: p.phone,
          email: p.email,
          location: p.location,
          latitude: p.latitude,
          longitude: p.longitude,
          description: p.description,
          status: p.status
        }));
      } catch (error) {
        console.error("Error fetching parlours:", error);
      } finally {
        this.loading = false;
      }
    },
    openApproveDialog(id) {
      this.selectedParlourId = id;
      this.approveDialog = true;
    },
    async confirmApprove() {
      try {
        const token = localStorage.getItem('authToken'); // Retrieve the token
        await axios.put(`http://192.168.1.200:8086/api/admin/approveParlour/${this.selectedParlourId}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the headers
          }
        });
        this.fetchParlours();
        this.approveDialog = false;
      } catch (error) {
        console.error("Error approving parlour:", error);
      }
    },
    openDeleteDialog(id) {
      this.selectedParlourId = id;
      this.deleteDialog = true;
    },
    async confirmDelete() {
      try {
        const token = localStorage.getItem('authToken'); // Retrieve the token
        await axios.delete(`http://192.168.1.200:8086/api/admin/deleteParlour/${this.selectedParlourId}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the headers
          }
        });
        this.fetchParlours();
        this.deleteDialog = false;
      } catch (error) {
        console.error("Error deleting parlour:", error);
      }
    },
    logout() {
      localStorage.removeItem('authToken'); // Clear the token
      this.$router.push('/login'); // Redirect to login page
    }
  },
  mounted() {
    this.fetchParlours(); // Fetch parlours when the component is mounted
  }
}
</script>
<style scoped>
.admin-panel {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 20px;
}

.logo-container {
  text-align: center;
  margin-bottom: 20px;
}

.menu {
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.menu-item.active {
  background-color: #e0e0e0;
}

.icon {
  margin-right: 10px;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.date-display {
  font-size: 0.9rem;
  color: gray;
}

.circular-btn {
  margin-right: 5px;
}
</style>