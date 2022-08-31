<template>
  <div>
    <h1>Data Analysis</h1>
    <br />
    Your name: <b>{{ myName }}</b> <br />
    <br />
    <div>
      <h3>
        You can pick a time range to filter messages (by default, all messages
        are shown):
      </h3>
      <n-date-picker
        v-model:value="range"
        type="daterange"
        clearable
        :style="{ width: '25%' }"
      />
    </div>
    <br /><br />
    <n-row>
      <n-col :span="8">
        <n-statistic label="Total messages" :value="filteredMessages.length" />
      </n-col>
      <n-col :span="8">
        <n-statistic label="Received" :value="nbSentMessages" />
      </n-col>
      <n-col :span="8">
        <n-statistic label="Sent" :value="nbReceivedMessages" />
      </n-col>
    </n-row>
    <br /><br />

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
    nbSentMessages() {
      return this.filteredMessages.filter((m) => m.sender === this.myName)
        .length;
    },
    nbReceivedMessages() {
      return this.filteredMessages.length - this.nbSentMessages;
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
