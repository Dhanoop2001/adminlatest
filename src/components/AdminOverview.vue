<template>
  <v-app id="inspire">
    <v-app-bar
      style="z-index: 1;background-image: linear-gradient(135deg, transparent 0%, transparent 50%,rgba(159, 159, 159,0.07) 50%, rgba(159, 159, 159,0.07) 77%,transparent 77%, transparent 100%),linear-gradient(90deg, transparent 0%, transparent 91%,rgba(159, 159, 159,0.07) 91%, rgba(159, 159, 159,0.07) 99%,transparent 99%, transparent 100%),linear-gradient(135deg, transparent 0%, transparent 24%,rgba(159, 159, 159,0.07) 24%, rgba(159, 159, 159,0.07) 63%,transparent 63%, transparent 100%),linear-gradient(0deg, transparent 0%, transparent 49%,rgba(159, 159, 159,0.07) 49%, rgba(159, 159, 159,0.07) 63%,transparent 63%, transparent 100%),linear-gradient(90deg, rgb(0,0,0),rgb(0,0,0));"
      color="teal-darken-4"
    >
      <v-app-bar-title>saloninfo</v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <section id="wrapper">
      <div class="p-4 ">
        <div class="welcome">
          <div class="content rounded-3 p-3">
            <h1 class="fs-3" style="margin-top: 40px;">Welcome to Saloninfo</h1>
          </div>
        </div>

        <section class="statistics mt-4">
          <div class="cards-container">
            <v-card class="bg" :style="{ width: '280px', marginBottom: '20px', height:'120px' }" v-for="(stat, index) in statistics" :key="index">
              <div class="box d-flex rounded-2 align-items-center mb-4 mb-lg-0 p-3">
                <i :class="stat.icon + ' fs-2 text-center rounded-circle'" :style="stat.iconStyle"></i>
                <div class="ms-3">
                  <div class="d-flex align-items-center">
                    <h3 class="mb-0">{{ getStatisticValue(stat, selectedTimeframe[index]) }}</h3> <span class="d-block ms-2">{{ stat.label }}</span>
                  </div>
                  <p class="fs-normal mb-0">{{ stat.description }}</p>
                </div>
              </div>
              <div class="dropdown" style="position: absolute; top: 80px; right: 5px;width: 130px; height: 40px;">
                <v-select v-if="index>1" density="compact" v-model="selectedTimeframe[index]" :items="timeframes"></v-select>
              </div>
            </v-card>
          </div>
        </section>

        <section class="charts mt-4">
          <div class="row">
            <v-card :style="{ width: '578px', marginBottom: '20px' }">
              <div class="chart-container rounded-2 p-3">
                <h3 class="fs-6 mb-3">Total Income : 4,45784</h3>
                <bar-chart />
              </div>
            </v-card>
            <v-card :style="{ width: '582px', marginBottom: '20px' }">
              <div class="chart-container rounded-2 p-3">
                <h3 class="fs-6 mb-3">Parlour categories</h3>
                <doughnut-chart />
              </div>
            </v-card>
          </div>
        </section>
      </div>
    </section>
  </v-app>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';
import '@iconscout/unicons/css/line.css';
import { ref } from 'vue';
import BarChart from './BarChart.vue';
import DoughnutChart from './DoughnutChart.vue';

export default {
  name: 'AdminOverview',
  components: {
    BarChart,
    DoughnutChart
  },
  setup() {
    const selectedTimeframe = ref(['today', 'today', 'today', 'today']);
    const timeframes = ['today', 'monthly', 'yearly'];

    const statistics = [
      { icon: 'fas fa-store',  value: 108, description: 'Total Parlours' },
      { icon: 'fas fa-users', value: 112, description: 'Total Users' },
      { icon: 'fas fa-calendar-check', values: [80, 2400, 864000], description: 'Total Booking' },
      { icon: 'uil-rupee-sign', values: [15000, 450000, 4457084], description: 'Total Income' }
    ];

    const getStatisticValue = (stat, timeframe) => {
      if (Array.isArray(stat.values)) {
        switch (timeframe) {
          case 'today':
            return stat.values[0];
          case 'monthly':
            return stat.values[1];
          case 'yearly':
            return stat.values[2];
        }
      }
      return stat.value;
    };

    return {
      selectedTimeframe,
      timeframes,
      statistics,
      getStatisticValue
    };
  },
  methods:{
    logout() {
      console.log("logout");
      this.$router.push("/"); 
    },
  }
};
</script>

<style scoped>
  /* Styling for the overall container */
  #wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f4f4f4;
    min-height: 100vh; /* Ensure full height */
    flex-grow: 1; /* Allow wrapper to take available space */
  }

  /* Styling for the welcome section */
  .welcome {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .content {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 800px;
  }

  h1.fs-3 {
    text-align: center;
    margin-top: 40px;
    font-size: 1.8rem;
  }

  /* Styling for the statistics section */
  .statistics {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    flex-grow: 1; /* Ensure it takes available space */
  }

  .cards-container {
    display: flex;
    flex-direction: row; /* Align cards side by side */
    justify-content: center; /* Align the cards in the center */
    gap: 20px; /* Spacing between cards */
    flex-wrap: wrap; /* Allow cards to wrap when there's not enough space */
  }

  /* Individual statistics card styling */
  .v-card.bg {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: rgb(0, 0, 0);
    border-radius: 10px;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    height: 120px;
    width: 280px;
  }

  .box {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .fs-2 {
    font-size: 2rem;
  }

  .ms-3 {
    margin-left: 15px;
  }

  .fs-normal {
    font-size: 1rem;
  }

  .dropdown {
    position: absolute;
    top: 80px;
    right: 5px;
    width: 130px;
    height: 40px;
  }

  /* Styling for charts section */
  .charts .row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-grow: 1; /* Ensure charts section expands */
  }

  .chart-container {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h3.fs-6 {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
</style>
