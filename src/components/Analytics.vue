<template>
  <div>
    Your insights here
    <br />
    Name: {{ myName }} <br />

    <div>
      You can pick a time range to filter messages:
      <n-date-picker v-model:value="range" type="daterange" clearable />
    </div>

    Messages: {{ filteredMessages.length }} <br /><br />

    <div>
      <BarChart
        v-if="conversationCountGroupChartData"
        :chartData="conversationCountGroupChartData"
        class="count-by-conv-chart"
      />
      <BarChart
        v-if="conversationCountDMChartData"
        :chartData="conversationCountDMChartData"
        class="count-by-conv-chart"
      />
    </div>
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
      range: null,
    };
  },
  computed: {
    filteredMessages() {
      if (this.range !== null) {
        return this.messages.filter(
          (m) => m.timestamp > this.range[0] && m.timestamp < this.range[1]
        );
      }
      return this.messages;
    },
    conversationsSummary() {
      const messageCounts = d3.rollup(
        this.filteredMessages,
        (group) => {
          const myMessages = group.filter(
            (message) => message.sender === this.myName
          );
          return {
            total: group.length,
            sentMessages: myMessages.length,
            receivedMessages: group.length - myMessages.length,
            conversationType: group[0].conversationType,
          };
        },
        (m) => m.conversationName
      );

      const data = [];
      messageCounts.forEach((value, key) => {
        data.push({ conversation: key, summary: value });
      });
      data.sort((a, b) => {
        return b.summary.total - a.summary.total;
      });
      return data;
    },
    conversationCountGroupChartData() {
      const data = this.conversationsSummary.filter(
        (c) => c.summary.conversationType === "RegularGroup"
      );
      return {
        labels: data.map((c) => c.conversation),
        datasets: [
          {
            data: data.map((c) => c.summary.total),
            label: "Exchanged messages",
            backgroundColor: "lightGreen",
            barThickness: 20,
          },
        ],
      };
    },
    conversationCountDMChartData() {
      const data = this.conversationsSummary.filter(
        (c) => c.summary.conversationType === "Regular"
      );
      return {
        labels: data.map((c) => c.conversation),
        datasets: [
          {
            data: data.map((c) => c.summary.total),
            label: "Exchanged messages",
            backgroundColor: "lightGreen",
            barThickness: 20,
          },
        ],
      };
    },
  },
});
</script>
<style>
.count-by-conv-chart {
  width: 48%;
  height: 600px;
  overflow-y: auto;
  display: inline-block;
}
</style>
