<template>
    <div class="services-page">
      <div class="header">
        <h1>Services Management</h1>
        <button class="add-service-btn" @click="openAddServiceDialog">Add New Service</button>
      </div>
  
      <!-- Services List -->
      <div class="services-grid">
        <div class="service-card" v-for="(service, index) in services" :key="index">
          <img :src="service.image" alt="Service Image" class="service-image" />
          <div class="service-details">
            <h3>{{ service.name }}</h3>
            <p>Price: ${{ service.price }}</p>
          </div>
          <div class="service-actions">
            <button class="edit-btn" @click="editService(index)">✏️ Edit</button>
            <button class="delete-btn" @click="deleteService(index)">🗑️ Delete</button>
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
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        services: [
          { name: "Haircut", price: 25, image: "https://via.placeholder.com/150" },
          { name: "Facial", price: 50, image: "https://via.placeholder.com/150" },
          { name: "Manicure", price: 30, image: "https://via.placeholder.com/150" },
        ],
        dialog: false,
        dialogTitle: "",
        serviceData: {
          name: "",
          price: "",
          image: "",
        },
        editIndex: -1,
      };
    },
    methods: {
      openAddServiceDialog() {
        this.dialogTitle = "Add New Service";
        this.serviceData = { name: "", price: "", image: "" };
        this.editIndex = -1;
        this.dialog = true;
      },
      editService(index) {
        this.dialogTitle = "Edit Service";
        this.serviceData = { ...this.services[index] };
        this.editIndex = index;
        this.dialog = true;
      },
      deleteService(index) {
        this.services.splice(index, 1);
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
    },
  };
  </script>
  
  <style scoped>
  .services-page {
    background: url('@/assets/salon.jpg') no-repeat center center fixed;
    background-size: cover;
    color: #fff;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
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
  }
  
  .add-service-btn {
    background-color: black;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .services-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .service-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    color: #fff;
    width: 100%;
    max-width: 300px;
  }
  
  .service-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  
  .service-details h3 {
    margin: 10px 0;
  }
  
  .service-actions {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
  }
  
  .edit-btn,
  .delete-btn {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 1.1rem;
  }
  
  .edit-btn:hover {
    color: #4caf50;
  }
  
  .delete-btn:hover {
    color: #f44336;
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
  
  .dialog {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    color: #000;
    max-width: 400px;
    width: 100%;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .dialog-actions button {
    background-color: black;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .image-preview img {
    max-width: 100%;
    max-height: 150px;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    box-sizing: border-box;
  }
  </style>

