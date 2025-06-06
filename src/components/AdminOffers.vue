<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex">
    <!-- Sidebar -->
    <SideBar />

    <!-- Main Content -->
    <main class="flex-1 p-10">
      <h1 class="text-3xl font-bold mb-6 text-purple-900">Top 5 Revenue Approved Parlours</h1>

      <!-- Loading & Error -->
      <div v-if="loading" class="text-center text-gray-600 text-lg flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading...
      </div>
      <div v-else-if="error" class="text-center text-red-600 text-lg">{{ error }}</div>
      <div v-else-if="!isAuthenticated" class="text-center text-gray-600 text-lg">
        Please log in to view approved parlours.
      </div>

      <!-- Parlour Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="parlour in topParlours"
          :key="parlour.id"
          class="bg-white rounded-2xl shadow-lg p-6 transition hover:scale-105 hover:shadow-xl"
        >
          <h2 class="text-xl font-semibold text-purple-800 mb-2">{{ parlour.parlourName }}</h2>
          <p class="text-gray-700 mb-2">Revenue: ₹{{ formatRevenue(parlour.revenue) }}</p>
          <button
            @click="offerDiscount(parlour)"
            :disabled="loadingOffer[parlour.id]"
            class="mt-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-2 px-4 rounded"
          >
            <span v-if="loadingOffer[parlour.id]">Sending...</span>
            <span v-else>Give Offer</span>
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mt-6 text-green-700 font-semibold text-lg">
        {{ successMessage }}
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import SideBar from './SideBar.vue'; // Adjust the path based on your project structure

// State variables
const approvedParlours = ref([]);
const loading = ref(false);
const error = ref(null);
const successMessage = ref('');
const loadingOffer = reactive({});
const isAuthenticated = ref(!!sessionStorage.getItem('authToken'));

// Validate token format
const isValidToken = (token) => {
  return typeof token === 'string' && token.length > 0;
};

// Format revenue for display
const formatRevenue = (revenue) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(revenue);
};

// Computed property to get top 5 approved parlours by revenue
const topParlours = computed(() => {
  return [...approvedParlours.value]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
});

// Fetch all registered parlours
const fetchAllParlours = async () => {
  const token = sessionStorage.getItem('authToken');
  if (!isAuthenticated.value || !isValidToken(token)) {
    error.value = 'Please log in to view parlour data.';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get('http://192.168.1.19:8086/api/admin/allRegisteredParlour', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('Parlours API Response:', {
      status: response.status,
      data: response.data
    });

    approvedParlours.value = response.data.filter(p => p.status === 1);
  } catch (err) {
    console.error('Fetch error:', {
      message: err.message,
      response: err.response ? {
        status: err.response.status,
        data: err.response.data
      } : null,
      code: err.code
    });

    if (err.response?.status === 401 || err.response?.status === 403) {
      isAuthenticated.value = false;
      sessionStorage.removeItem('authToken');
      error.value = 'Your session has expired. Please log in again.';
    } else if (err.code === 'ECONNABORTED') {
      error.value = 'Request timed out. Please check your network and try again.';
    } else {
      error.value = err.response?.data?.message || 'Failed to fetch parlour data.';
    }
  } finally {
    loading.value = false;
  }
};

// Send discount offer
const offerDiscount = async (parlour) => {
  const token = sessionStorage.getItem('authToken');
  if (!isAuthenticated.value || !isValidToken(token)) {
    error.value = 'Please log in to send discounts.';
    return;
  }

  loadingOffer[parlour.id] = true;
  error.value = null;
  successMessage.value = '';

  try {
    const response = await axios.post(
      'http://192.168.1.19:8086/api/discount/add',
      {
        parlourId: parlour.id,
        discount: 10,
        message: `Congratulations! You are approved with ${formatRevenue(parlour.revenue)} revenue. Enjoy a 10% discount!`
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('Discount API Response:', {
      status: response.status,
      data: response.data
    });

    successMessage.value = `Discount sent to ${parlour.parlourName}`;
    setTimeout(() => (successMessage.value = ''), 4000);
  } catch (err) {
    console.error('Offer error:', {
      message: err.message,
      response: err.response ? {
        status: err.response.status,
        data: err.response.data
      } : null,
      code: err.code
    });

    if (err.response?.status === 401 || err.response?.status === 403) {
      isAuthenticated.value = false;
      sessionStorage.removeItem('authToken');
      error.value = 'Your session has expired. Please log in again.';
    } else if (err.code === 'ECONNABORTED') {
      error.value = 'Request timed out. Please check your network and try again.';
    } else {
      error.value = err.response?.data?.message || 'Failed to send discount.';
    }
  } finally {
    loadingOffer[parlour.id] = false;
  }
};

// Fetch data on mount if authenticated
onMounted(() => {
  if (isAuthenticated.value) {
    fetchAllParlours();
  } else {
    error.value = 'Please log in to access this page.';
  }
});
</script>

<style scoped>
main {
  padding: 2.5rem;
}

.min-h-screen {
  min-height: 100vh;
}

.flex {
  display: flex;
}
</style>