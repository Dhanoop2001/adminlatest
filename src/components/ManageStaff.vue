<template>
  <div class="admin-dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <h1>Salon Info</h1>
      </div>
      <nav class="navigation">
        <ul>
          <li @click="filterCategory('all')">All Staff</li>
          <li @click="filterCategory('stylists')">Stylists</li>
          <li @click="filterCategory('therapists')">Therapists</li>
          <li @click="filterCategory('receptionists')">Receptionists</li>
          <li @click="filterCategory('hair cutting')">Hair Cutting</li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="header">
        <h1>Manage Salon Info Staff</h1>
        <button @click="showModal = true" class="add-staff-btn">+ Add Staff</button>
      </header>

      <!-- Staff Table -->
      <div class="staff-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(staff, index) in filteredStaff" :key="index">
              <td>{{ staff.name }}</td>
              <td>{{ staff.role }}</td>
              <td>{{ staff.contact }}</td>
              <td class="actions">
                <button @click="editStaff(index)">✏️</button>
                <button @click="removeStaff(index)">❌</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Add/Edit Staff Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ isEditing ? 'Edit Staff' : 'Add Staff' }}</h2>
        <form @submit.prevent="handleSubmit">
          <input v-model="staff.name" type="text" placeholder="Full Name" required />

          <!-- Role Dropdown -->
          <select v-model="staff.role" required>
            <option value="" disabled selected>Select Role</option>
            <option value="Stylists">Stylists</option>
            <option value="Therapists">Therapists</option>
            <option value="Receptionists">Receptionists</option>
            <option value="Hair Cutting">Hair Cutting</option>
          </select>

          <input v-model="staff.contact" type="email" placeholder="Email" required />

          <button type="submit" class="save-btn">{{ isEditing ? 'Save Changes' : 'Add Staff' }}</button>
        </form>
        <button class="close-btn" @click="resetForm">✖</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      staff: { name: '', role: '', contact: '' },
      staffList: [],
      showModal: false,
      isEditing: false,
      editIndex: null,
      filteredStaff: [],
      selectedCategory: 'all',
    };
  },
  methods: {
    handleSubmit() {
      if (this.isEditing) {
        this.staffList[this.editIndex] = { ...this.staff };
      } else {
        this.staffList.push({ ...this.staff });
      }
      this.resetForm();
    },
    editStaff(index) {
      this.staff = { ...this.filteredStaff[index] };
      this.isEditing = true;
      this.editIndex = this.staffList.indexOf(this.filteredStaff[index]);
      this.showModal = true;
    },
    removeStaff(index) {
      const originalIndex = this.staffList.indexOf(this.filteredStaff[index]);
      if (originalIndex !== -1) {
        this.staffList.splice(originalIndex, 1);
      }
      this.filterCategory(this.selectedCategory);
    },
    resetForm() {
      this.staff = { name: '', role: '', contact: '' };
      this.isEditing = false;
      this.editIndex = null;
      this.showModal = false;
    },
    filterCategory(category) {
      this.selectedCategory = category;
      if (category === 'all') {
        this.filteredStaff = this.staffList;
      } else {
        this.filteredStaff = this.staffList.filter(
          (staff) => staff.role.toLowerCase() === category.toLowerCase()
        );
      }
    },
  },
  mounted() {
    this.filteredStaff = this.staffList;
  },
};
</script>

<style scoped>
/* General Styling */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: white;
  color: black;
  font-family: 'Arial', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 25%;
  background: black;
  color: gold;
  padding: 20px;
  text-align: center;
}

.sidebar .logo {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 12px 15px;
  margin: 10px 0;
  cursor: pointer;
  text-transform: capitalize;
  background: gold;
  color: black;
  border-radius: 5px;
}

.sidebar li:hover {
  background: black;
  color: gold;
  border: 1px solid gold;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-staff-btn {
  background-color: gold;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.add-staff-btn:hover {
  background-color: black;
  color: gold;
}

/* Staff Table */
.staff-table table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.staff-table th,
.staff-table td {
  padding: 10px;
  border: 1px solid #e0e0e0;
  text-align: left;
}

.staff-table th {
  background-color: gold;
  color: black;
}

.actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.actions button:hover {
  color: gold;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 40px;
  border-radius: 10px;
  width: 400px;
  position: relative;
}

.modal h2 {
  margin-bottom: 20px;
}

.modal form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal form input,
.modal form select {
  height: 40px;
  padding: 5px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.save-btn {
  height: 40px;
  cursor: pointer;
  background: gold;
  color: black;
  border: none;
  border-radius: 5px;
}

.save-btn:hover {
  background: black;
  color: gold;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.close-btn:hover {
  color: gold;
}
</style>
