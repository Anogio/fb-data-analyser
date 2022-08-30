<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale
);

export default {
  name: "BarChart",
  components: { Bar },
  data() {
    return {
      chartId: "bar-chart",
      datasetIdKey: "label",
      width: 100,
      height: 200,
      cssClasses: "",
      styles: {},
      plugins: [],
      chartOptions: {
        responsive: true,
        indexAxis: "y",

        scales: {
          x: {
            display: true,
            type: "logarithmic",
          },
          y: {
            display: true,
          },
        },
      },
    };
  },
  props: {
    chartData: {
      required: true,
      default: {
        labels: ["January", "February", "March"],
        datasets: [{ data: [40, 20, 12] }],
      },
    },
  },
};
</script>
