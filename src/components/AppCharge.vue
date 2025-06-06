
<template>
  <v-app>
    <v-container fluid class="pa-0">
      <div class="floating-elements">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>
      <v-row no-gutters class="flex-container">
        <!-- Sidebar -->
        <v-col cols="12" sm="3" md="2" class="sidebar">
          <SideBar />
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" sm="9" md="10" class="main-content">
          <v-container class="content-container">
            <h1 class="my-4 page-title">App Charge Management</h1>

            <!-- Add or Update Form -->
            <v-form @submit.prevent="confirmSubmit" class="charge-form">
              <v-text-field
                v-model.number="charge.startRange"
                type="number"
                label="Start Range"
                required
                :min="0"
                outlined
                dense
                class="form-input"
                :rules="[rules.required, rules.nonNegative]"
                hint="Starting value of the charge range (e.g., 0 for $0)"
                persistent-hint
              />
              <v-text-field
                v-model.number="charge.endRange"
                type="number"
                label="End Range"
                required
                :min="0"
                outlined
                dense
                class="form-input"
                :rules="[rules.required, rules.nonNegative, rules.greaterThanStart]"
                hint="Ending value of the charge range (e.g., 100 for $100)"
                persistent-hint
              />
              <v-text-field
                v-model.number="charge.percentage"
                type="number"
                step="0.01"
                label="Percentage (%)"
                required
                :min="0"
                :max="100"
                outlined
                dense
                class="form-input"
                :rules="[rules.required, rules.percentage]"
                hint="Charge percentage (0-100, e.g., 2.5 for 2.5%)"
                persistent-hint
              />
              <v-btn
                type="submit"
                :disabled="loading || !formValid"
                class="submit-btn"
                :class="{ 'update-btn': isUpdate }"
              >
                {{ isUpdate ? 'Update Charge' : 'Add Charge' }}
              </v-btn>
              <v-btn
                v-if="isUpdate"
                text
                class="btn-cancel ml-2"
                @click="resetForm"
                :disabled="loading"
              >
                Cancel Update
              </v-btn>
            </v-form>

            <!-- Charges Table -->
            <div class="table-container">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Search charges..."
                single-line
                hide-details
                clearable
                class="mb-4"
              />
              <table class="charge-table">
                <thead>
                  <tr>
                    <th @click="sort('id')" class="sortable">
                      ID <v-icon small>{{ sortIcon('id') }}</v-icon>
                    </th>
                    <th @click="sort('startRange')" class="sortable">
                      Start <v-icon small>{{ sortIcon('startRange') }}</v-icon>
                    </th>
                    <th @click="sort('endRange')" class="sortable">
                      End <v-icon small>{{ sortIcon('endRange') }}</v-icon>
                    </th>
                    <th @click="sort('percentage')" class="sortable">
                      Percentage <v-icon small>{{ sortIcon('percentage') }}</v-icon>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in filteredCharges" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.startRange }}</td>
                    <td>{{ item.endRange }}</td>
                    <td>{{ item.percentage }}%</td>
                    <td>
                      <v-btn
                        small
                        class="action-btn"
                        @click="confirmEdit(item)"
                        :disabled="loading"
                      >
                        Edit
                      </v-btn>
                      <v-btn
                        small
                        class="action-btn delete-btn"
                        @click="confirmDelete(item)"
                        :disabled="loading"
                      >
                        Delete
                      </v-btn>
                    </td>
                  </tr>
                  <tr v-if="!filteredCharges.length">
                    <td colspan="5" class="text-center">No charges found</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Confirmation Modal -->
            <v-dialog v-model="showConfirmModal" max-width="500px" class="modal">
              <v-card class="modal-content">
                <v-card-title class="modal-header">
                  <span>{{ confirmModal.title }}</span>
                  <v-spacer />
                  <v-btn icon @click="closeModal" class="close-btn">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text class="modal-body">
                  <p>{{ confirmModal.message }}</p>
                </v-card-text>
                <v-card-actions class="modal-footer">
                  <v-btn class="btn-cancel" text @click="closeModal">Cancel</v-btn>
                  <v-btn
                    class="btn-confirm"
                    :class="confirmModal.type"
                    text
                    @click="confirmAction"
                  >
                    {{ confirmModal.confirmText }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Success/Error Modal -->
            <v-dialog v-model="showNotificationModal" max-width="400px" class="modal">
              <v-card class="modal-content notification-modal">
                <v-card-title class="modal-header" :class="notificationModal.type">
                  <span>
                    <v-icon v-if="notificationModal.type === 'success'" class="modal-icon"
                      >mdi-check-circle</v-icon
                    >
                    <v-icon v-else class="modal-icon">mdi-close-circle</v-icon>
                    {{ notificationModal.title }}
                  </span>
                  <v-spacer />
                  <v-btn icon @click="closeNotificationModal" class="close-btn">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text class="modal-body">
                  <p>{{ notificationModal.message }}</p>
                </v-card-text>
                <v-card-actions class="modal-footer">
                  <v-btn class="btn-primary" text @click="closeNotificationModal">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import SideBar from '@/components/SideBar.vue';

// Reactive state
const charge = ref({ startRange: '', endRange: '', percentage: '' });
const charges = ref([]);
const isUpdate = ref(false);
const selectedId = ref(null);
const loading = ref(false);
const search = ref('');
const sortKey = ref('id');
const sortOrder = ref('asc');

// Modal states
const showConfirmModal = ref(false);
const showNotificationModal = ref(false);
const confirmModal = ref({
  title: '',
  message: '',
  confirmText: '',
  type: '',
  action: null,
});
const notificationModal = ref({
  title: '',
  message: '',
  type: '',
});

// Form validation rules
const rules = {
  required: (value) => !!value || value === 0 || 'Required',
  nonNegative: (value) => value >= 0 || 'Must be non-negative',
  greaterThanStart: (value) =>
    (value > charge.value.startRange && charge.value.startRange !== '') ||
    'End Range must be greater than Start Range',
  percentage: (value) => (value >= 0 && value <= 100) || 'Must be between 0 and 100',
};

// Computed property to check if form is valid
const formValid = computed(() => {
  return (
    charge.value.startRange !== '' &&
    charge.value.endRange !== '' &&
    charge.value.percentage !== '' &&
    charge.value.startRange >= 0 &&
    charge.value.endRange > charge.value.startRange &&
    charge.value.percentage >= 0 &&
    charge.value.percentage <= 100 &&
    !hasOverlappingRange()
  );
});

// Computed property for filtered and sorted charges
const filteredCharges = computed(() => {
  let result = [...charges.value];
  
  // Filter by search
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.id.toString().includes(lowerSearch) ||
        item.startRange.toString().includes(lowerSearch) ||
        item.endRange.toString().includes(lowerSearch) ||
        item.percentage.toString().includes(lowerSearch)
    );
  }

  // Sort
  result.sort((a, b) => {
    const key = sortKey.value;
    const order = sortOrder.value === 'asc' ? 1 : -1;
    return a[key] > b[key] ? order : -order;
  });

  return result;
});

// Check for overlapping ranges
const hasOverlappingRange = () => {
  return charges.value.some((item) => {
    if (isUpdate.value && item.id === selectedId.value) return false; // Skip the item being updated
    return (
      (charge.value.startRange >= item.startRange && charge.value.startRange <= item.endRange) ||
      (charge.value.endRange >= item.startRange && charge.value.endRange <= item.endRange) ||
      (charge.value.startRange <= item.startRange && charge.value.endRange >= item.endRange)
    );
  });
};

// Fetch charges
const fetchCharges = async () => {
  try {
    loading.value = true;
    const res = await axios.get('http://192.168.1.19:8086/api/appCharge/allCharge', { timeout: 5000 });
    charges.value = res.data;
  } catch (err) {
    handleError(err, 'fetching charges');
  } finally {
    loading.value = false;
  }
};

// Validate charge
const validateCharge = () => {
  if (!formValid.value) {
    showNotification('Validation Error', 'Please correct the form errors.', 'error');
    return false;
  }
  if (hasOverlappingRange()) {
    showNotification('Validation Error', 'The range overlaps with an existing charge.', 'error');
    return false;
  }
  return true;
};

// Submit charge
const submitCharge = async () => {
  if (!validateCharge()) return;
  loading.value = true;
  try {
    const sanitizedCharge = {
      startRange: Number(charge.value.startRange),
      endRange: Number(charge.value.endRange),
      percentage: Number(charge.value.percentage),
    };
    if (isUpdate.value) {
      await axios.put(`http://192.168.1.19:8086/api/appCharge/updateCharge?Id=${selectedId.value}`, sanitizedCharge, {
        timeout: 5000,
      });
      showNotification('Success', 'Charge updated successfully!', 'success');
    } else {
      await axios.post('http://192.168.1.19:8086/api/appCharge/addCharge', sanitizedCharge, { timeout: 5000 });
      showNotification('Success', 'Charge added successfully!', 'success');
    }
    resetForm();
    await fetchCharges();
  } catch (err) {
    handleError(err, 'submitting charge');
  } finally {
    loading.value = false;
  }
};

// Delete charge
const deleteCharge = async (id) => {
  loading.value = true;
  try {
    await axios.delete(`http://192.168.1.19:8086/api/appCharge/deleteCharge?Id=${id}`, { timeout: 5000 });
    showNotification('Success', 'Charge deleted successfully!', 'success');
    await fetchCharges();
  } catch (err) {
    handleError(err, 'deleting charge');
  } finally {
    loading.value = false;
  }
};

// Error handling
const handleError = (err, action) => {
  console.error(`${action} Error:`, err);
  let message = `Failed to ${action}. Please try again.`;
  if (err.response) {
    if (err.response.status === 400) message = 'Invalid data provided.';
    else if (err.response.status === 404) message = 'Charge not found.';
    else if (err.response.status === 500) message = 'Server error. Please contact support.';
  } else if (err.code === 'ECONNABORTED') {
    message = 'Request timed out. Please check your network.';
  }
  showNotification('Error', message, 'error');
};

// Modal functions
const showConfirmation = (title, message, confirmText, type, action) => {
  confirmModal.value = { title, message, confirmText, type, action };
  showConfirmModal.value = true;
};

const showNotification = (title, message, type) => {
  notificationModal.value = { title, message, type };
  showNotificationModal.value = true;
};

const closeModal = () => {
  showConfirmModal.value = false;
};

const closeNotificationModal = () => {
  showNotificationModal.value = false;
};

const confirmAction = () => {
  if (confirmModal.value.action) {
    confirmModal.value.action();
  }
  closeModal();
};

// Confirmation handlers
const confirmSubmit = () => {
  const action = isUpdate.value ? 'update' : 'add';
  showConfirmation(
    'Confirm Action',
    `Are you sure you want to ${action} this charge (${charge.value.startRange}-${charge.value.endRange}, ${charge.value.percentage}%)?`,
    action.charAt(0).toUpperCase() + action.slice(1),
    'primary',
    submitCharge
  );
};

const confirmEdit = (item) => {
  showConfirmation(
    'Edit Charge',
    `Do you want to edit the charge (${item.startRange}-${item.endRange}, ${item.percentage}%)?`,
    'Edit',
    'primary',
    () => {
      charge.value = { ...item };
      selectedId.value = item.id;
      isUpdate.value = true;
    }
  );
};

const confirmDelete = (item) => {
  showConfirmation(
    'Delete Charge',
    `Are you sure you want to delete the charge (${item.startRange}-${item.endRange}, ${item.percentage}%)? This action cannot be undone.`,
    'Delete',
    'danger',
    () => deleteCharge(item.id)
  );
};

const resetForm = () => {
  charge.value = { startRange: '', endRange: '', percentage: '' };
  isUpdate.value = false;
  selectedId.value = null;
};

// Sorting
const sort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const sortIcon = (key) => {
  if (sortKey.value !== key) return 'mdi-chevron-up';
  return sortOrder.value === 'asc' ? 'mdi-chevron-up' : 'mdi-chevron-down';
};

// Initialize
onMounted(fetchCharges);
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
  --success: #2E7D32;
  --shadow-light: rgba(44, 24, 16, 0.08);
  --shadow-medium: rgba(44, 24, 16, 0.15);
  --shadow-heavy: rgba(44, 24, 16, 0.25);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.v-application {
  background: linear-gradient(135deg, var(--cream) 0%, #F5F0EA 50%, var(--cream) 100%);
  position: relative;
}

.flex-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.floating-elements {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(147, 111, 90, 0.12), rgba(145, 73, 52, 0.06));
  animation: float 25s infinite ease-in-out;
}

.floating-shape.shape-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -150px;
  animation-delay: 0s;
}

.floating-shape.shape-2 {
  width: 350px;
  height: 350px;
  bottom: -100px;
  right: -150px;
  animation-delay: -8s;
}

.floating-shape.shape-3 {
  width: 250px;
  height: 250px;
  top: 20%;
  right: 10%;
  animation-delay: -16s;
}

.floating-shape.shape-4 {
  width: 180px;
  height: 180px;
  bottom: 25%;
  left: 10%;
  animation-delay: -24s;
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

.sidebar {
  background: linear-gradient(180deg, var(--primary-brown) 0%, var(--secondary-brown) 100%);
  color: var(--white);
}

.main-content {
  background: transparent;
  flex-grow: 1;
  position: relative;
  z-index: 2;
  padding-left: 32px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  color: var(--text-dark);
  font-weight: 600;
  font-size: 2rem;
  margin: 16px 0;
  text-shadow: 0 2px 8px var(--shadow-light);
  text-align: center;
}

.charge-form {
  background: var(--white);
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--shadow-medium), 0 2px 8px var(--shadow-light);
  padding: 24px;
  max-width: 500px;
  margin-bottom: 24px;
}

.form-input .v-input__control {
  font-family: 'Inter', sans-serif;
  color: var(--text-dark);
}

.form-input .v-label {
  color: var(--text-medium);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.form-input .v-input__slot {
  border-radius: 8px;
  background: #FEFDFB;
}

.submit-btn {
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: none;
  border-radius: 12px;
  padding: 10px 24px;
  box-shadow: 0 4px 16px var(--shadow-medium), 0 2px 8px var(--shadow-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px var(--shadow-heavy), 0 4px 16px var(--shadow-medium);
  background: linear-gradient(135deg, var(--dark-brown), var(--secondary-brown));
}

.submit-btn:disabled {
  background: linear-gradient(135deg, #A0A0A0, #808080);
  cursor: not-allowed;
}

.table-container {
  background: var(--white);
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--shadow-medium), 0 2px 8px var(--shadow-light);
  overflow-x: auto;
  padding: 24px;
}

.charge-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 600px;
}

.charge-table th,
.charge-table td {
  padding: 16px;
  text-align: left;
  font-family: 'Inter', sans-serif;
  color: var(--text-dark);
  font-size: 0.95rem;
  border-bottom: 1px solid #E8DDD4;
}

.charge-table th {
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 3;
}

.charge-table th:first-child {
  border-top-left-radius: 12px;
}

.charge-table th:last-child {
  border-top-right-radius: 12px;
}

.charge-table tr {
  transition: background-color 0.3s ease;
}

.charge-table tr:hover {
  background-color: #FEFDFB;
}

.charge-table td {
  color: var(--text-medium);
  font-weight: 500;
}

.action-btn {
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
  margin-right: 8px;
  box-shadow: 0 4px 16px var(--shadow-medium);
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: linear-gradient(135deg, var(--dark-brown), var(--secondary-brown));
  box-shadow: 0 8px 32px var(--shadow-heavy);
}

.action-btn:disabled {
  background: linear-gradient(135deg, #A0A0A0, #808080);
  cursor: not-allowed;
}

.delete-btn {
  background: linear-gradient(135deg, var(--error), #B71C1C);
}

.delete-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #B71C1C, var(--error));
}

.modal-content {
  background: var(--white);
  border-radius: 24px;
  box-shadow: 0 32px 64px var(--shadow-heavy), 0 16px 32px var(--shadow-medium);
  backdrop-filter: blur(20px);
}

.modal-header {
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
  padding: 24px 32px;
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.modal-header.success {
  background: linear-gradient(135deg, var(--success), #1B5E20);
}

.modal-header.error {
  background: linear-gradient(135deg, var(--error), #B71C1C);
}

.modal-icon {
  margin-right: 8px;
}

.close-btn {
  color: var(--white);
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: var(--light-brown);
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 24px 32px;
  font-family: 'Inter', sans-serif;
  color: var(--text-medium);
  font-size: 1rem;
  line-height: 1.6;
}

.modal-footer {
  padding: 24px 32px;
  background: #FEFDFB;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  background: linear-gradient(135deg, #A0A0A0, #808080);
  color: var(--white);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: none;
  border-radius: 12px;
  padding: 10px 24px;
  box-shadow: 0 4px 16px var(--shadow-medium);
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px var(--shadow-heavy);
  background: linear-gradient(135deg, #808080, #606060);
}

.btn-confirm {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: none;
  border-radius: 12px;
  padding: 10px 24px;
  box-shadow: 0 4px 16px var(--shadow-medium);
  transition: all 0.3s ease;
  color: var(--white);
}

.btn-confirm.primary {
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
}

.btn-confirm.primary:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, var(--dark-brown), var(--secondary-brown));
  box-shadow: 0 8px 32px var(--shadow-heavy);
}

.btn-confirm.danger {
  background: linear-gradient(135deg, var(--error), #B71C1C);
}

.btn-confirm.danger:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #B71C1C, var(--error));
  box-shadow: 0 8px 32px var(--shadow-heavy);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
  color: var(--white);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: none;
  border-radius: 12px;
  padding: 10px 24px;
  box-shadow: 0 4px 16px var(--shadow-medium);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, var(--dark-brown), var(--secondary-brown));
  box-shadow: 0 8px 32px var(--shadow-heavy);
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: linear-gradient(135deg, var(--dark-brown), var(--secondary-brown));
}

.text-center {
  text-align: center;
  color: var(--text-medium);
  font-family: 'Inter', sans-serif;
  padding: 16px;
}

/* Responsive Styles */
@media (max-width: 599px) {
  .flex-container {
    flex-direction: column;
    height: auto;
  }

  .sidebar {
    order: 2;
    min-height: auto;
    position: relative;
  }

  .main-content {
    order: 1;
    padding: 8px;
    padding-left: 16px;
  }

  .content-container {
    padding: 8px;
  }

  .page-title {
    font-size: 1.5rem;
    margin: 12px 0 20px 0;
  }

  .charge-form {
    padding: 16px;
    max-width: 100%;
  }

  .table-container {
    padding: 16px;
  }

  .charge-table {
    font-size: 0.85rem;
    min-width: unset;
  }

  .charge-table th,
  .charge-table td {
    padding: 10px;
  }

  .action-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }

  .modal-content {
    width: 95%;
    max-width: 320px;
  }

  .modal-header {
    padding: 16px 24px;
    font-size: 1.2rem;
  }

  .modal-body {
    padding: 16px 24px;
    font-size: 0.9rem;
  }

  .modal-footer {
    padding: 16px 24px;
    flex-direction: column;
    gap: 8px;
  }

  .floating-shape {
    display: none;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .page-title {
    font-size: 1.75rem;
  }

  .main-content {
    padding-left: 24px;
  }

  .content-container {
    padding: 12px;
  }

  .charge-table {
    font-size: 0.9rem;
  }

  .charge-table th,
  .charge-table td {
    padding: 12px;
  }
}

@media (min-width: 960px) and (max-width: 1263px) {
  .page-title {
    font-size: 1.9rem;
  }

  .main-content {
    padding-left: 28px;
  }

  .content-container {
    padding: 14px;
  }
}

@media (min-width: 1264px) and (max-width: 1903px) {
  .page-title {
    font-size: 2rem;
  }

  .main-content {
    padding-left: 32px;
  }

  .content-container {
    padding: 16px;
  }
}

@media (min-width: 1904px) {
  .page-title {
    font-size: 2.2rem;
  }

  .main-content {
    padding-left: 40px;
  }

  .content-container {
    padding: 20px;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .flex-container {
    height: auto;
    min-height: 100vh;
  }

  .main-content {
    padding-left: 24px;
  }

  .charge-table th,
  .charge-table td {
    padding: 8px;
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .table-container,
  .charge-form {
    box-shadow: 0 8px 32px var(--shadow-light), 0 2px 8px var(--shadow-light);
  }
}

@media print {
  .sidebar {
    display: none;
  }

  .main-content {
    width: 100% !important;
    max-width: 100% !important;
    flex: none !important;
    padding-left: 16px;
  }

  .table-container {
    box-shadow: none !important;
    border: 1px solid #E8DDD4;
  }

  .floating-elements,
  .modal {
    display: none;
  }
}

@media (hover: none) and (pointer: coarse) {
  .charge-table tr:hover,
  .action-btn:hover,
  .submit-btn:hover,
  .btn-cancel:hover,
  .btn-confirm:hover,
  .btn-primary:hover {
    transform: none;
    background: inherit;
  }

  .charge-table tr:active {
    background-color: #FEFDFB;
  }

  .action-btn:active,
  .submit-btn:active,
  .btn-cancel:active,
  .btn-confirm:active,
  .btn-primary:active {
    transform: scale(0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  .charge-table tr,
  .action-btn,
  .submit-btn,
  .btn-cancel,
  .btn-confirm,
  .btn-primary {
    transition: none;
  }

  .floating-shape {
    animation: none;
  }
}

@media (prefers-color-scheme: dark) {
  .main-content {
    background: transparent;
  }

  .page-title {
    color: var(--text-dark);
  }

  .charge-form,
  .table-container {
    background: var(--white);
    border-color: #E8DDD4;
  }

  .charge-table th {
    background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
    color: var(--white);
  }

  .charge-table td {
    color: var(--text-medium);
  }

  .modal-content {
    background: var(--white);
  }
}
</style>
