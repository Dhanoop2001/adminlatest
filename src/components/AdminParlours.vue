<template>
  <v-app id="inspire">
    <v-app-bar color="teal-darken-4" dense>
      <v-toolbar-title class="white--text">SalonInfo</v-toolbar-title>
    </v-app-bar>

    <v-main>
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

        <!-- Parlour Requests Table -->
        <v-container>
          <v-card class="elevation-2 pa-4">
            <v-data-table 
              :items="tab === 'pending' ? pendingParlours : approvedParlours" 
              class="elevation-1"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.sl_no }}</td>
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.licenseNumber }}</td>
                  <td>{{ item.phone }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.location }}</td>
                  <td>{{ item.latitude }}</td>
                  <td>{{ item.longitude }}</td>
                  <td>{{ item.description }}</td>
                  <td>
                    <v-btn v-if="tab === 'pending'" color="success" small @click="approveParlour(item.id)">Approve</v-btn>
                    <v-btn color="error" small class="ml-2" @click="deleteParlour(item.id)">Delete</v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-container>

        <!-- Confirmation Dialog for Deletion -->
        <v-dialog v-model="deleteDialog" max-width="400">
          <v-card>
            <v-card-title class="headline">Confirm Deletion</v-card-title>
            <v-card-text>
              Are you sure you want to delete this parlour?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="deleteDialog = false">No</v-btn>
              <v-btn color="red darken-1" text @click="confirmDelete">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
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
      deleteDialog: false,
      selectedParlourId: null
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
        const token = localStorage.getItem("adminToken");
        if (!token) {
          this.$router.push("/log-in");
          return;
        }

        const response = await axios.get("http://192.168.1.34:8086/api/admin/allRegisteredParlour", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("API Response:", response.data); // Debugging line

        this.parlours = Array.isArray(response.data) ? response.data.map((p, index) => ({
          sl_no: index + 1,
          id: p.id,
          name: p.parlourName,
          licenseNumber: p.licenseNumber || "N/A", // Fetching License Number
          phone: p.phoneNumber,
          email: p.email,
          location: p.location,
          latitude: p.latitude || "N/A",
          longitude: p.longitude || "N/A",
          description: p.description,
          status: p.status
        })) : [];

      } catch (error) {
        console.error("Error fetching parlours:", error.response ? error.response.data : error.message);
      } finally {
        this.loading = false;
      }
    },
    async approveParlour(id) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.put(`http://192.168.1.34:8086/api/admin/approve?id=${id}&status=1`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fetchParlours();
      } catch (error) {
        console.error("Error approving parlour:", error.response ? error.response.data : error.message);
      }
    },
    deleteParlour(id) {
      this.selectedParlourId = id;
      this.deleteDialog = true;
    },
    async confirmDelete() {
      if (this.selectedParlourId) {
        try {
          const token = localStorage.getItem("adminToken");
          await axios.delete(`http://192.168.1.34:8086/api/admin/parlour/delete?id=${this.selectedParlourId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.fetchParlours();
        } catch (error) {
          console.error("Error deleting parlour:", error.response ? error.response.data : error.message);
        } finally {
          this.deleteDialog = false;
          this.selectedParlourId = null;
        }
      }
    }
  },
  created() {
    this.fetchParlours();
  }
};
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}
</style>
