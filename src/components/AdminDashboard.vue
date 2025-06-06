<template>
  <div class="dashboard">
    <SideBar @change-view="setView" />

    <main class="main-content">
      <h1>{{ currentViewTitle }}</h1>

      <div v-if="currentView === 'home'">
        <p>Welcome to the Home Dashboard!</p>
        <div class="cards">
          <div class="card">
            <h3>Total Users</h3>
            <p>{{ users.length }}</p>
          </div>
          <div class="card">
            <h2>Appcharge</h2>
            <h3>Percentage %</h3>
            <p>{{ charges.length }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="currentView === 'analytics'">
        <p>User & Charge Distribution</p>
        <canvas ref="chartRef" width="400" height="200"></canvas>
      </div>

      <div v-else-if="currentView === 'settings'">
        <p>Settings page content.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'
import SideBar from './SideBar.vue'

const currentView = ref('home')
const users = ref([])
const charges = ref([])
const chartRef = ref(null)
let chartInstance = null

function setView(view) {
  currentView.value = view
}

const currentViewTitle = computed(() => {
  switch (currentView.value) {
    case 'home': return 'Home'
    case 'analytics': return 'Analytics'
    case 'settings': return 'Settings'
    default: return ''
  }
})

const fetchData = async () => {
  try {
    const [usersRes, chargesRes] = await Promise.all([
      axios.get('http://192.168.1.19:8086/api/admin/getAllUsers'),
      axios.get('http://192.168.1.19:8086/api/appCharge/allCharge')
    ])
    users.value = usersRes.data
    charges.value = chargesRes.data
  } catch (error) {
    console.error('Dashboard fetch error:', error)
  }
}

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const data = {
    labels: charges.value.map((c, i) => `Range ${i + 1}`),
    datasets: [
      {
        label: 'Charge Percentage',
        data: charges.value.map(c => c.percentage),
        backgroundColor: '#4b6cb7'
      }
    ]
  }

  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data,
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Charge Percentage by Range' }
      }
    }
  })
}

watch(currentView, (newVal) => {
  if (newVal === 'analytics' && charges.value.length > 0) {
    setTimeout(() => renderChart(), 300)
  }
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.main-content {
  flex: 1;
  padding: 30px;
  background-color: #ecf0f1;
}

.cards {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex: 1;
  text-align: center;
}

canvas {
  margin-top: 20px;
}
</style>
