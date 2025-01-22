<!-- <template>
  <div class="services-page">
    <div class="header">
      <h1>Services Management</h1>
      <button class="add-service-btn" @click="openAddServiceDialog">+ Add New Service</button>
    </div>

    <!-- Services List -->
    <div class="services-grid">
      <div class="service-card" v-for="(service, index) in services" :key="index">
        <img :src="service.image" alt="Service Image" class="service-image" />
        <div class="service-details">
          <h3>{{ service.name }}</h3>
          <p class="price">
            <span v-if="service.offerPrice" class="original-price">Original Price: ₹{{ service.price }}</span>
            <span v-if="service.offerPrice" class="offer-price">Offer Price: ₹{{ service.offerPrice }}</span>
            <span v-else class="price-text">Price: ₹{{ service.price }}</span>
          </p>
          <p v-if="service.offerPrice" class="offer-percentage">
            {{ calculateOfferPercentage(service.price, service.offerPrice) }}% off
          </p>
        </div>
        <div class="service-actions">
          <button class="edit-btn" @click="editService(index)">✏️ Edit</button>
          <button class="delete-btn" @click="confirmDeleteService(index)">🗑️ Delete</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Service Dialog -->
    <div v-if="dialog" class="dialog-overlay">
      <div class="dialog">
        <h2>{{ dialogTitle }}</h2>
        <form @submit.prevent="saveService">
          <div class="form-group">
            <label for="serviceName">Service Name</label>
            <input id="serviceName" v-model="serviceData.name" type="text" required />
          </div>
          <div class="form-group">
            <label for="servicePrice">Price</label>
            <input id="servicePrice" v-model="serviceData.price" type="number" required />
          </div>
          <div class="form-group">
            <label for="offerPrice">Offer Price</label>
            <input id="offerPrice" v-model="serviceData.offerPrice" type="number" />
          </div>
          <div class="form-group">
            <label for="serviceImage">Image</label>
            <input id="serviceImage" type="file" @change="onImageChange" />
            <div v-if="serviceData.image" class="image-preview">
              <img :src="serviceData.image" alt="Preview" />
            </div>
          </div>
          <div class="dialog-actions">
            <button type="button" @click="closeDialog">Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Popup -->
    <div v-if="showDeleteConfirm" class="delete-confirm-overlay">
      <div class="delete-confirm-dialog">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this service?</p>
        <div class="delete-confirm-actions">
          <button @click="cancelDelete" class="cancel-btn">Cancel</button>
          <button @click="deleteService(deleteIndex)" class="confirm-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      services: [], // Empty array for dynamic data
      dialog: false,
      dialogTitle: "",
      serviceData: {
        name: "",
        price: "",
        offerPrice: "",
        image: "",
      },
      editIndex: -1,
      showDeleteConfirm: false,
      deleteIndex: -1,
    };
  },
  methods: {
    openAddServiceDialog() {
      this.dialogTitle = "Add New Service";
      this.serviceData = { name: "", price: "", offerPrice: "", image: "" };
      this.editIndex = -1;
      this.dialog = true;
    },
    editService(index) {
      this.dialogTitle = "Edit Service";
      this.serviceData = { ...this.services[index] };
      this.editIndex = index;
      this.dialog = true;
    },
    confirmDeleteService(index) {
      this.deleteIndex = index;
      this.showDeleteConfirm = true;
    },
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.deleteIndex = -1;
    },
    deleteService(index) {
      this.services.splice(index, 1);
      this.showDeleteConfirm = false;
      this.deleteIndex = -1;
    },
    saveService() {
      if (!this.serviceData.name || !this.serviceData.price || !this.serviceData.image) {
        alert("All fields are required.");
        return;
      }
      if (this.editIndex === -1) {
        this.services.push({ ...this.serviceData });
      } else {
        this.services[this.editIndex] = { ...this.serviceData };
      }
      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
    },
    onImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.serviceData.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    calculateOfferPercentage(originalPrice, offerPrice) {
      if (offerPrice && originalPrice) {
        return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
      }
      return 0;
    },
  },
};
</script>

<style scoped>
.services-page {
  background: url('@/assets/salon.jpg') no-repeat center center fixed;
  background-size: cover;
  position: relative;
  min-height: 100vh;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.services-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

.services-page > * {
  position: relative;
  z-index: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: gold;
}

.add-service-btn {
  background-color: black;
  color: gold;
  border: 2px solid gold;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.add-service-btn:hover {
  background-color: gold;
  color: black;
  border: 2px solid black;
  font-size: 1rem;
}

.services-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.service-card {
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #fff;
  width: 100%;
  max-width: 300px;
  transition: transform 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.service-details h3 {
  margin: 10px 0;
  color: white;
}

.service-details p {
  margin: 5px 0;
  color: #fff;
}

.original-price {
  color: #aaa;
  font-size: 1rem;
  text-decoration: line-through;
}

.offer-price {
  color: gold;
  font-weight: bold;
  font-size: 1.2rem;
}

.price-text {
  color: gold;
  font-size: 1.2rem;
}

.offer-percentage {
  font-size: 1rem;
  color: gold;
}

.service-actions {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}

.edit-btn,
.delete-btn {
  background: none;
  border: 2px solid transparent;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s, border 0.3s;
}

.edit-btn:hover {
  color: gold;
  border: 2px solid gold;
}

.delete-btn:hover {
  color: white;
  border: 2px solid white;
}

.dialog-overlay {
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

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.dialog {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 10px;
  color: black;
  max-width: 400px;
  width: 100%;
}

.dialog h2 {
  color: black;
}

.dialog-actions button {
  background-color: black;
  color: gold;
  border: 2px solid gold;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.dialog-actions button:hover {
  background-color: gold;
  color: black;
  font-size: 1rem;
  border: 2px solid black;
}

.image-preview img {
  max-width: 100%;
  max-height: 150px;
  margin-top: 10px;
  border: 1px solid gold;
  border-radius: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid gold;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
}

.delete-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.delete-confirm-dialog {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 10px;
  color: black;
  max-width: 300px;
  width: 100%;
  text-align: center;
}

.delete-confirm-dialog h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: gold;
}

.delete-confirm-dialog p {
  font-size: 1rem;
  margin-bottom: 20px;
  color: black;
}

.delete-confirm-actions {
  display: flex;
  justify-content: space-around;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 20px;
  font-size: 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  border: 2px solid gold;
  background: black;
  color: gold;
  transition: background-color 0.3s, color 0.3s;
}

.cancel-btn:hover {
  background: white;
  color: black;
}

.confirm-btn:hover {
  background: gold;
  color: black;
  border: 2px solid black;
}
</style> -->
