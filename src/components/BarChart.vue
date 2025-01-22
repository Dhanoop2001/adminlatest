<template>

    <div class="chart-container">
      <canvas ref="barChart"></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
name: 'BarChart',
mounted() {
  this.renderChart();
},
methods: {
  renderChart() {
    const ctx = this.$refs.barChart.getContext('2d');

    const labels = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const data = {
      labels: labels,
      datasets: [{
        label: 'monthly income',
        data: [65, 59, 80, 81, 56, 55, 40, 70, 85, 90, 95, 100],
        backgroundColor: [
          'rgba(117,117,117)',
          'rgba(117,117,117)',
          'rgba(117,117,117)',
          'rgba(117,117,117)',
          'rgba(117,117,117)',
          'rgba(117,117,117)',
          'rgba(117,117,117)',
          'rgba(117,117,117)',
          'rgba(117,117,117)',
          'rgba(117,117,117)',
          'rgba(117,117,117)',
          'rgba(117,117,117)'
        ],
        borderColor: [
          'rgba(128, 128, 128, 1)',
          'rgba(169, 169, 169, 1)',
          'rgba(192, 192, 192, 1)',
          'rgba(211, 211, 211, 1)',
          'rgba(220, 220, 220, 1)',
          'rgba(245, 245, 245, 1)',
          'rgba(128, 128, 128, 1)',
          'rgba(169, 169, 169, 1)',
          'rgba(192, 192, 192, 1)',
          'rgba(211, 211, 211, 1)',
          'rgba(220, 220, 220, 1)',
          'rgba(245, 245, 245, 1)'
        ],
        borderWidth: 1
      }]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };

    new Chart(ctx, config);
  }
}
};
</script>

<style scoped>
.chart-container {
width: 520px;
height: 300px;
}

</style>
