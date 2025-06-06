<template>
  <v-app>
    <v-container fluid class="pa-0">
      <v-row no-gutters class="flex-container">
        <!-- Sidebar -->
        <v-col cols="12" sm="3" md="2" class="sidebar">
          <SideBar />
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" sm="9" md="10" class="main-content">
          <v-container class="content-container">
            <h1 class="my-4 page-title">All Employees</h1>
            <v-row align="stretch" justify="start">
              <v-col
                v-for="employee in employees"
                :key="employee.id"
                cols="12" sm="6" md="4" lg="3"
              >
                <v-card class="employee-card" elevation="3">
                  <v-card-title class="employee-name">{{ employee.employeeName }}</v-card-title>
                  <v-card-subtitle class="employee-id">PARLOUR ID: {{ employee.id }}</v-card-subtitle>
                  <v-card-actions class="card-actions">
                    <v-spacer></v-spacer>
                    <v-btn small color="primary" outlined @click="showEmployeeDetails(employee)">
                      View Details
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>

    <!-- Employee Details Dialog -->
    <v-dialog v-model="dialogVisible" max-width="400px">
      <v-card class="employee-details-dialog">
        <v-card-title class="dialog-header">
          <span class="dialog-title">Employee Details</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogVisible = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="text-center pa-6">
          <div class="employee-image-container">
            <v-avatar size="150" class="employee-avatar">
              <v-img 
                v-if="getImageSrc(selectedEmployee.image)"
                :src="getImageSrc(selectedEmployee.image)" 
                :alt="selectedEmployee.employeeName"
                cover
              />
              <v-icon v-else size="80" color="grey lighten-1">mdi-account</v-icon>
            </v-avatar>
          </div>
          
          <h2 class="employee-detail-name mt-4 mb-2">{{ selectedEmployee.employeeName }}</h2>
          <p class="employee-detail-id">PARLOUR ID: {{ selectedEmployee.id }}</p>
        </v-card-text>
        
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogVisible = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import SideBar from "@/components/SideBar.vue"; // Adjust the path if needed

export default {
  name: "AdminEmployees",
  components: {
    SideBar,
  },
  data() {
    return {
      employees: [],
      dialogVisible: false,
      selectedEmployee: {
        employeeName: '',
        id: '',
        image: ''
      }
    };
  },
  mounted() {
    this.fetchEmployees();
  },
  methods: {
    fetchEmployees() {
      console.log("Fetching employees...");
      fetch("http://192.168.1.19:8086/api/admin/getAllEmployees")
        .then((response) => {
          console.log("Response status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched employees:", data);
          this.employees = data;
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
        });
    },
    showEmployeeDetails(employee) {
      this.selectedEmployee = { ...employee };
      this.dialogVisible = true;
    },
    getImageSrc(base64Image) {
      if (!base64Image) {
        return null; // Return null to show the placeholder icon
      }
      
      // Check if the base64 string already has the data URL prefix
      if (base64Image.startsWith('data:image/')) {
        return base64Image;
      }
      
      // If it's just the base64 string without prefix, add the data URL prefix
      // Assuming it's a JPEG image, you can modify this based on your image format
      return `data:image/jpeg;base64,${base64Image}`;
    }
  },
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

.v-application {
  background: linear-gradient(135deg, var(--cream) 0%, #F5F0EA 50%, var(--cream) 100%);
  position: relative;
  overflow: hidden;
}

.flex-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  position: relative;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
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
  top: -150px;
  left: -200px;
  animation-delay: 0s;
}

.floating-shape.shape-2 {
  width: 350px;
  height: 350px;
  bottom: -120px;
  right: 700px;
  animation-delay: -8s;
}

.floating-shape.shape-1 {
  width: 250px;
  height: 250px;
  top: 15%;
  left: 8%;
  animation-delay: -16s;
}

.floating-shape.shape-2 {
  width: 180px;
  height: 180px;
  bottom: 30%;
  left: 5%;
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
  z-index: 1;
  padding-left: 32px; /* Shift content right to clear sidebar */
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
}

.employee-card {
  background: var(--white);
  border: none;
  border-radius: 20px !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px var(--shadow-medium),
    0 2px 8px var(--shadow-light);
  margin: 0 8px 16px 8px;
  max-width: 280px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.employee-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 60px var(--shadow-heavy),
    0 8px 32px var(--shadow-medium);
}

.employee-name {
  font-family: 'Inter', sans-serif;
  color: var(--text-dark) !important;
  font-weight: 700;
  font-size: 1.2rem;
  padding: 20px 20px 8px 20px;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.employee-id {
  font-family: 'Inter', sans-serif;
  color: var(--text-light) !important;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0 20px 16px 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
}

.card-actions {
  padding: 0 20px 24px 20px;
  background: #FEFDFB;
}

.v-btn {
  border: none !important;
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown)) !important;
  color: var(--white) !important;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: none;
  border-radius: 12px !important;
  padding: 10px 24px !important;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
  box-shadow: 
    0 4px 16px var(--shadow-medium),
    0 2px 8px var(--shadow-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 32px var(--shadow-heavy),
    0 4px 16px var(--shadow-medium);
  background: linear-gradient(135deg, var(--dark-brown), var(--secondary-brown)) !important;
}

/* Dialog Styles */
.employee-details-dialog {
  background: var(--white);
  border-radius: 24px !important;
  overflow: hidden;
  box-shadow: 
    0 32px 64px var(--shadow-heavy),
    0 16px 32px var(--shadow-medium);
  backdrop-filter: blur(20px);
}

.dialog-header {
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown));
  color: var(--white) !important;
  padding: 24px 32px;
  position: relative;
}

.dialog-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.employee-image-container {
  margin-bottom: 24px;
  position: relative;
}

.employee-avatar {
  border: 4px solid transparent;
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown)) padding-box,
              linear-gradient(135deg, var(--light-brown), var(--dark-brown)) border-box;
  box-shadow: 
    0 16px 48px var(--shadow-medium),
    0 8px 24px var(--shadow-light);
  position: relative;
}

.employee-avatar::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(147, 111, 90, 0.1), transparent);
  z-index: -1;
}

.employee-detail-name {
  font-family: 'Inter', sans-serif;
  color: var(--text-dark);
  font-weight: 700;
  font-size: 1.6rem;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.employee-detail-id {
  font-family: 'Inter', sans-serif;
  color: var(--text-light);
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
}

.dialog-actions {
  padding: 24px 32px;
  background: #FEFDFB;
}

.v-dialog .v-btn {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: none;
  border-radius: 12px !important;
  padding: 12px 32px !important;
  font-size: 1rem;
  letter-spacing: 0.3px;
  background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown)) !important;
  color: var(--white) !important;
  box-shadow: 
    0 6px 20px var(--shadow-medium),
    0 2px 8px var(--shadow-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-dialog .v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 10px 32px var(--shadow-heavy),
    0 4px 16px var(--shadow-medium);
  background: linear-gradient(135deg, var(--dark-brown), var(--secondary-brown)) !important;
}

/* Responsive CSS */
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
    padding-left: 16px; /* Reduced padding for mobile */
  }
  
  .content-container {
    padding: 8px;
  }
  
  .page-title {
    font-size: 1.5rem;
    text-align: center;
    margin: 12px 0 20px 0;
  }
  
  .employee-card {
    max-width: 100% !important;
    margin: 0 8px 16px 8px;
  }
  
  .employee-name {
    font-size: 1rem;
    line-height: 1.3;
  }
  
  .employee-id {
    font-size: 0.8rem;
  }
  
  .card-actions {
    padding: 6px 12px 12px 12px;
  }
  
  .v-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
  
  .employee-details-dialog {
    margin: 12px;
    max-width: calc(100vw - 24px) !important;
  }
  
  .employee-avatar {
    width: 120px !important;
    height: 120px !important;
    border-width: 3px;
  }
  
  .employee-detail-name {
    font-size: 1.3rem;
  }
  
  .employee-detail-id {
    font-size: 0.9rem;
  }
  
  .dialog-header {
    padding: 12px 16px;
  }
  
  .dialog-title {
    font-size: 1.1rem;
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
  
  .employee-card {
    max-width: 240px;
    margin: 0 8px 16px 8px;
  }
  
  .employee-name {
    font-size: 1.05rem;
  }
  
  .employee-avatar {
    width: 130px !important;
    height: 130px !important;
  }
  
  .employee-detail-name {
    font-size: 1.4rem;
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
  
  .employee-card {
    max-width: 260px;
    margin: 0 10px 20px 10px;
  }
  
  .employee-avatar {
    width: 140px !important;
    height: 140px !important;
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
  
  .employee-card {
    max-width: 280px;
    margin: 0 12px 24px 12px;
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
  
  .employee-card {
    max-width: 300px;
    margin: 0 14px 28px 14px;
  }
  
  .employee-name {
    font-size: 1.2rem;
  }
  
  .employee-id {
    font-size: 0.9rem;
  }
  
  .employee-avatar {
    width: 160px !important;
    height: 160px !important;
  }
  
  .employee-detail-name {
    font-size: 1.6rem;
  }
  
  .employee-detail-id {
    font-size: 1.1rem;
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
  
  .employee-details-dialog {
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .employee-avatar {
    width: 100px !important;
    height: 100px !important;
  }
  
  .dialog-header {
    padding: 8px 16px;
  }
  
  .employee-detail-name {
    font-size: 1.2rem;
    margin: 8px 0;
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .employee-card {
    box-shadow: 
      0 8px 32px var(--shadow-light),
      0 2px 8px var(--shadow-light);
  }
  
  .employee-card:hover {
    box-shadow: 
      0 20px 60px var(--shadow-heavy),
      0 8px 32px var(--shadow-medium);
  }
  
  .employee-avatar {
    border-width: 3px;
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
  
  .employee-card {
    break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #E8DDD4;
  }
  
  .employee-card:hover {
    transform: none;
    box-shadow: none !important;
  }
  
  .v-btn {
    display: none;
  }
  
  .floating-elements {
    display: none;
  }
}

@media (hover: none) and (pointer: coarse) {
  .employee-card:hover {
    transform: none;
  }
  
  .employee-card:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
  
  .v-btn {
    padding: 8px 16px;
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .employee-card {
    transition: none;
  }
  
  .employee-card:hover {
    transform: none;
  }
  
  .employee-card:active {
    transform: none;
  }
  
  .v-btn {
    transition: none;
  }
  
  .v-btn:hover {
    transform: none;
  }
}

@media (prefers-color-scheme: dark) {
  .main-content {
    background: transparent;
  }
  
  .page-title {
    color: var(--text-dark);
  }
  
  .employee-card {
    background: var(--white);
    border-color: #E8DDD4;
  }
  
  .employee-name {
    color: var(--text-dark) !important;
  }
  
  .employee-id {
    color: var(--text-light) !important;
  }
}
</style>