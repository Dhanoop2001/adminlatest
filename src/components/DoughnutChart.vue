<template>
  <div>
    <canvas ref="doughnutChart" class="chart-canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart as ChartJS, DoughnutController, Title, Tooltip, ArcElement } from 'chart.js';

ChartJS.register(DoughnutController, Title, Tooltip, ArcElement);

export default {
  setup() {
    const doughnutChart = ref(null);

    onMounted(() => {
      const ctx = doughnutChart.value.getContext('2d');

      new ChartJS(ctx, {
        type: 'doughnut', // Change type to doughnut
        data: {
          labels: ['Male', 'Unisex', 'Female'],
          datasets: [{
            label: 'Category Distribution',
            data: [31, 18, 50],
            backgroundColor: ['#b1b1b1', '#e6e6e6', '#262626'],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true, // Enable responsive behavior
          maintainAspectRatio: false, // Allow resizing
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                }
              }
            }
          }
        }
      });
    });

    return {
      doughnutChart
    };
  }
};
</script>

<style scoped>
.chart-canvas {
  width: 100%; /* Full width for responsiveness */
  height: 300px; /* Set a height to fit the chart */
}
</style>
