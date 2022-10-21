<template>
  <Line
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
import { Line } from "vue-chartjs";
import "chartjs-adapter-date-fns";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  TimeScale,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  CategoryScale,
  TimeScale,
  LineElement
);

export default {
  name: "LineChart",
  components: { Line },
  data() {
    return {
      height: 50,
      displayGraph: true,
      chartId: "line-chart",
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
    title: {
      required: true,
    },
  },
  computed: {
    chartOptions() {
      return {
        animation: {
          duration: 0,
        },
        responsive: true,
        indexAxis: "x",
        plugins: {
          title: {
            display: true,
            text: this.title,
          },
          legend: {
            display: true,
          },
        },
        scales: {
          x: {
            display: true,
            type: "time",
          },
          y: {
            display: true,
          },
        },
      };
    },
  },
};
</script>
