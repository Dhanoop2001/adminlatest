<template>
  <div class="container">
    <h1 class="page-title">Manage Appointments</h1>

    <!-- Filters Section -->
    <div class="filters mb-4">
      <div class="filter-group">
        <input
          type="text"
          v-model="search"
          placeholder="Search by Customer"
          class="filter-input"
        />
      </div>
      <div class="filter-group">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">All Statuses</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
    </div>

    <!-- Appointment Table -->
    <table class="appointment-table">
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Date</th>
          <th>Time</th>
          <th>Service</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appointment in filteredAppointments" :key="appointment.id">
          <td>{{ appointment.customerName }}</td>
          <td>{{ appointment.date }}</td>
          <td>{{ appointment.time }} {{ appointment.timePeriod }}</td>
          <td>{{ appointment.service }}</td>
          <td>
            <span :class="'status ' + getStatusClass(appointment.status)">
              {{ appointment.status }}
            </span>
          </td>
          <td>
            <button class="btn-icon btn-edit" @click="editAppointment(appointment)">
              ✏️
            </button>
            <button class="btn-icon btn-delete" @click="deleteAppointment(appointment.id)">
              🗑️
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Appointment Modal -->
    <div v-if="isEditModalVisible" class="modal">
      <div class="modal-content">
        <h2>Edit Appointment</h2>
        <form @submit.prevent="saveAppointment">
          <div class="form-group">
            <label for="customerName">Customer Name:</label>
            <input
              id="customerName"
              type="text"
              v-model="editedAppointment.customerName"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="date">Date:</label>
            <input
              id="date"
              type="date"
              v-model="editedAppointment.date"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="time">Time:</label>
            <div class="time-container">
              <input
                id="time"
                type="time"
                v-model="editedAppointment.time"
                required
                class="form-input"
                step="900"
              />
              <select
                v-model="editedAppointment.timePeriod"
                required
                class="form-input time-period"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="service">Service:</label>
            <input
              id="service"
              type="text"
              v-model="editedAppointment.service"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="status">Status:</label>
            <select
              id="status"
              v-model="editedAppointment.status"
              required
              class="form-input"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div class="modal-buttons">
            <button type="submit" class="btn-submit">Save</button>
            <button type="button" class="btn-cancel" @click="closeEditModal">Cancel</button>
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
      appointments: [], // Empty array to store dynamic data
      search: '',
      selectedStatus: '',
      statuses: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
      isEditModalVisible: false,
      editedAppointment: null,
    };
  },
  computed: {
    filteredAppointments() {
      return this.appointments.filter((appointment) => {
        const matchesSearch =
          !this.search ||
          appointment.customerName
            .toLowerCase()
            .includes(this.search.toLowerCase());
        const matchesStatus =
          !this.selectedStatus || appointment.status === this.selectedStatus;
        return matchesSearch && matchesStatus;
      });
    },
  },
  methods: {
    fetchAppointments() {
      // Remove hardcoded data, appointments should be fetched dynamically
    },
    getStatusClass(status) {
      switch (status) {
        case 'Confirmed':
          return 'status-confirmed';
        case 'Pending':
          return 'status-pending';
        case 'Cancelled':
          return 'status-cancelled';
        case 'Completed':
          return 'status-completed';
        default:
          return '';
      }
    },
    editAppointment(appointment) {
      this.editedAppointment = { ...appointment }; // Clone the selected appointment
      this.isEditModalVisible = true;
    },
    saveAppointment() {
      const index = this.appointments.findIndex(
        (appointment) => appointment.id === this.editedAppointment.id
      );
      if (index !== -1) {
        this.appointments.splice(index, 1, this.editedAppointment);
      }
      this.closeEditModal();
    },
    deleteAppointment(appointmentId) {
      this.appointments = this.appointments.filter(
        (appointment) => appointment.id !== appointmentId
      );
      console.log('Deleted appointment', appointmentId);
    },
    closeEditModal() {
      this.isEditModalVisible = false;
      this.editedAppointment = null;
    },
  },
  mounted() {
    this.fetchAppointments();
  },
};
</script>

<style scoped>
/* Background Styling */
.container {
  background: url('@/assets/salon.jpg') no-repeat center center fixed;
  background-size: cover;
  color: #fff;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

/* Overlay */
.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.534); /* Light black tint */
  z-index: 1; /* Make sure the overlay is above the background but behind the content */
}

/* Ensure content stays above the overlay */
.container > * {
  position: relative;
  z-index: 2;
}

/* Page Title Styling */
.page-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
}

/* Filters Section */
.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 8px;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Appointment Table */
.appointment-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.appointment-table th,
.appointment-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
  color: #000;
}

.appointment-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  color: #000;
}

/* Status Styles */
.status {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
}

.status-confirmed {
  background-color: #ffd700;
  color: #000;
}

.status-pending {
  background-color: #333;
  color: #fff;
}

.status-cancelled {
  background-color: #dc3545;
  color: white;
}

.status-completed {
  background-color: #28a745;
  color: white;
}

/* Buttons */
.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin: 0 5px;
}

.btn-icon:hover {
  opacity: 0.8;
}

.btn-edit {
  color: #ffd700;
}

.btn-delete {
  color: red;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  border: 2px solid #ffd700;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
}

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-submit,
.btn-cancel {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
}

.btn-submit {
  background-color: #ffd700;
  color: #000;
  border: none;
}

.btn-submit:hover {
  background-color: #ffcc00;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
  border: none;
}

.btn-cancel:hover {
  background-color: #c82333;
}

/* Time Container */
.time-container {
  display: flex;
  gap: 5px;
}

.time-period {
  width: 70px;
  font-size: 16px;
}
</style>
