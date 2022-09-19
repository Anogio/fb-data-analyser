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
    };
  },
  props: {
    chartData: {
      required: true,
    },
    logScale: {
      required: true,
    },
    title: {
      required: true,
    },
    conversationIds: {
      required: false,
    },
  },
  computed: {
    chartOptions() {
      return {
        animation: {
          duration: 0,
        },
        responsive: true,
        indexAxis: "y",
        plugins: {
          title: {
            display: true,
            text: this.title,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: true,
            type: this.logScale ? "logarithmic" : "linear",
            position: "top",
            ticks: {
              maxRotation: 0,
              minRotation: 0,
            },
            min: this.logScale ? 0.6 : 1,
          },
          y: {
            display: true,
            ticks: {
              autoSkip: false,
            },
          },
        },
        onClick: (_event, clickedElements) => {
          if (this.conversationIds) {
            const convId = this.conversationIds[clickedElements[0].index];
            this.$router.push(`/conversation/${convId}`);
          }
        },
      };
    },
  },
  watch: {
    chartData: {
      immediate: true,
      handler(newValue) {
        // This is a voodoo formula I determined through experimentation
        // It is not very robust to various screen widths
        this.displayGraph = false;
        this.height = Math.floor(5 * newValue.datasets[0].data.length + 15);
        // Force the component to re-render to avoid reactivity / sizing issues
        this.$nextTick(() => {
          this.displayGraph = true;
        });
      },
    },
  },
};
</script>
