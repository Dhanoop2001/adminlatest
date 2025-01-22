<!-- <template>
  <div class="client-page">
    <div class="overlay">
      <h1>Clients</h1>
      <div class="client-list">
        <div v-for="client in clients" :key="client.id" class="client-card">
          <div class="card-content">
            <div class="client-info">
              <h2 class="client-name">{{ client.name }}</h2>
              <p class="client-email">{{ client.email }}</p>
              <p><strong>Phone:</strong> {{ client.phone }}</p>
              <p><strong>Last Visit:</strong> {{ client.lastVisit }}</p>
              <button @click="viewDetails(client)" class="view-details-btn">View Details</button>
            </div>
          </div>
        </div>
      </div>
      <button @click="openAddClientForm" class="add-client-btn">Add New Client</button>
    </div>

    <!-- Modal for Add Client Form -->
    <div v-if="isAddClientFormOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2 class="modal-title">Add New Client</h2>

        <form @submit.prevent="addClient">
          <div class="form-group">
            <label for="clientName">Name:</label>
            <input type="text" v-model="newClient.name" id="clientName" required />
          </div>

          <div class="form-group">
            <label for="clientEmail">Email:</label>
            <input type="email" v-model="newClient.email" id="clientEmail" required />
          </div>

          <div class="form-group">
            <label for="clientPhone">Phone:</label>
            <input type="text" v-model="newClient.phone" id="clientPhone" required />
          </div>

          <div class="form-group">
            <label for="clientAddress">Address:</label>
            <input type="text" v-model="newClient.address" id="clientAddress" required />
          </div>

          <div class="form-group">
            <label for="clientLastVisit">Last Visit:</label>
            <input type="date" v-model="newClient.lastVisit" id="clientLastVisit" required />
          </div>

          <button type="submit" class="save-btn">Save New Client</button>
        </form>

        <button @click="closeModal" class="close-btn">Close</button>
      </div>
    </div>

    <!-- Modal for View/Edit Client Details -->
    <div v-if="isClientDetailsOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2 class="modal-title">Client Details</h2>

        <form @submit.prevent="updateClientDetails">
          <div class="form-group">
            <label for="editClientName">Name:</label>
            <input type="text" v-model="selectedClient.name" id="editClientName" required />
          </div>

          <div class="form-group">
            <label for="editClientEmail">Email:</label>
            <input type="email" v-model="selectedClient.email" id="editClientEmail" required />
          </div>

          <div class="form-group">
            <label for="editClientPhone">Phone:</label>
            <input type="text" v-model="selectedClient.phone" id="editClientPhone" required />
          </div>

          <div class="form-group">
            <label for="editClientAddress">Address:</label>
            <input type="text" v-model="selectedClient.address" id="editClientAddress" required />
          </div>

          <div class="form-group">
            <label for="editClientLastVisit">Last Visit:</label>
            <input type="date" v-model="selectedClient.lastVisit" id="editClientLastVisit" required />
          </div>

          <button type="submit" class="save-btn">Update Client</button>
        </form>

        <button @click="closeModal" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clients: [],  // Empty array as no dummy data
      isAddClientFormOpen: false,
      isClientDetailsOpen: false,
      newClient: {
        name: '',
        email: '',
        phone: '',
        address: '',
        lastVisit: ''
      },
      selectedClient: null
    };
  },
  methods: {
    openAddClientForm() {
      this.isAddClientFormOpen = true;
    },
    closeModal() {
      this.isAddClientFormOpen = false;
      this.isClientDetailsOpen = false;
      this.resetNewClientForm();
    },
    addClient() {
      const newClientData = { ...this.newClient, id: this.clients.length + 1 };
      this.clients.push(newClientData);
      this.closeModal();
    },
    resetNewClientForm() {
      this.newClient = { name: '', email: '', phone: '', address: '', lastVisit: '' };
    },
    viewDetails(client) {
      this.selectedClient = { ...client };  // Clone client data
      this.isClientDetailsOpen = true;
    },
    updateClientDetails() {
      const index = this.clients.findIndex(client => client.id === this.selectedClient.id);
      if (index !== -1) {
        this.clients.splice(index, 1, this.selectedClient);  // Replace the old client data
      }
      this.closeModal();
    }
  }
};
</script>

<style scoped>
.client-page {
  background-image: url('@/assets/salon.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 40px;
  color: white;
}

.overlay {
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 1200px;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 3rem;
  color: gold;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

.client-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.client-card {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.card-content {
  padding: 20px;
}

.client-name {
  font-size: 1.6rem;
  color: gold;
  margin-bottom: 10px;
}

.client-email {
  color: #f5c518;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.client-info p {
  font-size: 1rem;
  color: white;
  margin: 5px 0;
}

.view-details-btn {
  background-color: gold;
  color: black;
  padding: 10px 20px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.view-details-btn:hover {
  background-color: black;
  color: gold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.add-client-btn {
  background-color: gold;
  color: black;
  padding: 15px 30px;
  font-size: 1.2rem;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 20px;
}

.add-client-btn:hover {
  background-color: black;
  color: gold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  color: black;
  padding: 30px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  text-align: left;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.modal-title {
  font-size: 2rem;
  color: gold;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 1.1rem;
  color: black;
  margin-bottom: 5px;
  display: block;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.save-btn {
  background-color: gold;
  color: black;
  padding: 10px 20px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-btn:hover {
  background-color: black;
  color: gold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.close-btn {
  background-color: gold;
  color: black;
  padding: 10px 20px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
}

.close-btn:hover {
  background-color: black;
  color: gold;
}
</style> -->
