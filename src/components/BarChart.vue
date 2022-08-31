<template>
  <Bar
    v-if="displayGraph"
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
      height: null,
      displayGraph: true,
      chartId: "bar-chart",
      datasetIdKey: "label",
      width: 100,
      cssClasses: "",
      styles: {},
      plugins: [],
      chartOptions: {
        responsive: true,
        indexAxis: "y",
        plugins: {
          title: {
            display: true,
            text: "Exchanged messages by conversation (log scale)",
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: true,
            type: "logarithmic",
            position: "top",
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
    },
  },
  watch: {
    chartData: {
      immediate: true,
      handler(newValue) {
        // This is a voodoo formula I determined through experimentation
        // It is not very robust to various screen widths
        this.displayGraph = false;
        this.height = Math.floor(5 * newValue.datasets[0].data.length + 1);
        // Force the component to re-render to avoid reactivity / sizing issues
        this.$nextTick(() => {
          this.displayGraph = true;
        });
      },
    },
  },
};
</script>
