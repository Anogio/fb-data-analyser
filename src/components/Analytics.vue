<template>
  <div>
    Your insights here
    <br />
    Name: {{ myName }} <br />
    Messages: {{ messages.length }} <br /><br />

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
      conversationCountChartData: null,
      topN: 50,
    };
  },
  created() {
    const messageCounts = d3.rollup(
      this.messages,
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

    this.conversationCountChartData = {
      labels: topNConversations.map((c) => c.conversation),
      datasets: [{ data: topNConversations.map((c) => c.nMessages) }],
    };
  },
});
</script>
