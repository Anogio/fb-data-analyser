<template>
  <div>
    Your insights here
    <br />
    Name: {{ myName }} <br />
    Messages: {{ messages.length }} <br /><br />

    <div>
      You can pick a time range to filter messages:
      <n-date-picker v-model:value="range" type="daterange" clearable />
    </div>

    <BarChart
      v-if="conversationCountChartData"
      :chartData="conversationCountChartData"
    />
  </div>
</template>

<script>
import * as d3 from "d3";
import { defineComponent } from "vue";

import BarChart from "./BarChart.vue";

export default defineComponent({
  name: "Analytics",
  components: { BarChart },
  props: ["messages", "myName"],
  data() {
    return {
      topN: 100,
      range: null,
    };
  },
  computed: {
    conversationCountChartData() {
      var filteredMessages = this.messages;
      if (this.range !== null) {
        filteredMessages = filteredMessages.filter(
          (m) => m.timestamp > this.range[0] && m.timestamp < this.range[1]
        );
      }
      const messageCounts = d3.rollup(
        filteredMessages,
        (g) => g.length,
        (m) => m.conversationName
      );

      const data = [];
      messageCounts.forEach((value, key) => {
        data.push({ conversation: key, nMessages: value });
      });
      data.sort((a, b) => {
        return b.nMessages - a.nMessages;
      });
      const topNConversations = data.slice(0, this.topN);

      return {
        labels: topNConversations.map((c) => c.conversation),
        datasets: [
          {
            data: topNConversations.map((c) => c.nMessages),
            label: "Number of messages (log scale)",
            barThickness: 20,
          },
        ],
      };
    },
  },
});
</script>
