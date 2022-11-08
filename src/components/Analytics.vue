<template>
  <div>
    <h1>Data Analysis</h1>
    <router-link to="/advanced">Go to advanced messages query</router-link>
    <br /><br />
    <div>
      <div>
        <n-button @click="animation(true)" :disabled="!!animationInterval">{{
          animationPaused ? "Restart animation" : "Animate !"
        }}</n-button>
        <n-button
          @click="
            stopAnimation();
            animationPaused = true;
          "
          :disabled="!animationInterval"
          >Pause animation</n-button
        >
        <n-button
          @click="
            animation(false);
            animationPaused = false;
          "
          :disabled="!animationPaused"
          >Resume animation</n-button
        >
      </div>
      <div>
        <br />
        <n-progress
          v-if="!!animationInterval || animationPaused"
          type="line"
          :percentage="
            Math.min(
              Math.ceil(
                ((this.range[1] - this.minTimestamp) /
                  (this.maxTimestamp - minTimestamp)) *
                  100
              ),
              100
            )
          "
          indicator-placement="inside"
        />
      </div>
      <h3>Click a bar on the chart to go to the detailed view</h3>
      <n-date-picker
        v-model:value="range"
        type="daterange"
        clearable
        :style="{ width: '250px' }"
      />
    </div>
    <br />
    <n-row
      :style="{ border: '1px solid', padding: '10px', borderRadius: '20px' }"
    >
      <n-col :span="8">
        <n-statistic label="Total messages" :value="filteredMessages.length" />
      </n-col>
      <n-col :span="8">
        <n-statistic label="Sent" :value="nbSentMessages" />
      </n-col>
      <n-col :span="8">
        <n-statistic label="Received" :value="nbReceivedMessages" />
      </n-col>
    </n-row>
    <br />
    <div>
      <n-switch v-model:value="logScale" /> Logarithmic scale
      <br />
      <BarChart
        v-if="conversationCountDMChartData"
        :chartData="conversationCountDMChartData"
        :logScale="logScale"
        :conversationIds="conversationDMIds"
        title="Exchanged messages - direct messaging"
        class="count-by-conv-chart"
      />
      <BarChart
        v-if="conversationCountGroupChartData"
        :chartData="conversationCountGroupChartData"
        :logScale="logScale"
        :conversationIds="conversationGroupIds"
        title="Exchanged messages - group chats"
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
  props: ["sortedMessages", "myName"],
  data() {
    return {
      range: null,
      animationInterval: null,
      animationPaused: false,
      logScale: true,
    };
  },
  methods: {
    stopAnimation() {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    },
    animation(restart) {
      this.animationPaused = false;
      if (this.animationInterval) {
        clearInterval(this.animationInterval);
      }

      if (this.minTimestamp === null || this.maxTimestamp == null) {
        console.log("No dates");
        return;
      }
      console.log(this.minTimestamp, this.maxTimestamp);
      const oneMonth = 1000 * 60 * 60 * 24 * 31; // ms -> s -> m -> h -> d -> mo
      if (restart) {
        this.range = [this.minTimestamp, this.minTimestamp + oneMonth];
      }
      console.log(this.range);
      this.animationInterval = setInterval(() => {
        this.range = [this.range[1], this.range[1] + oneMonth];
        if (this.range[1] > Math.min(this.maxTimestamp, Date.now())) {
          this.stopAnimation();
        }
      }, 1000);
    },
    firstMessagePositionAfterTimestamp(sortedMessagesArray, timestamp) {
      let start = 0,
        end = sortedMessagesArray.length - 1;
      let ans = -1;

      while (start <= end) {
        let mid = parseInt((start + end) / 2, 10);
        // Move to right side if target is
        // greater.
        if (sortedMessagesArray[mid].timestamp < timestamp) {
          start = mid + 1;
        }
        // Move left side.
        else {
          ans = mid;
          end = mid - 1;
        }
      }
      return ans == -1 ? sortedMessagesArray.length : ans;
    },
  },
  computed: {
    filteredMessages() {
      if (this.range !== null) {
        const startMessagePosition = this.firstMessagePositionAfterTimestamp(
          this.sortedMessages,
          this.range[0]
        );
        const endMessagePosition = this.firstMessagePositionAfterTimestamp(
          this.sortedMessages,
          this.range[1]
        );
        return this.sortedMessages.slice(
          startMessagePosition,
          endMessagePosition
        );
      }
      return this.sortedMessages;
    },
    minTimestamp() {
      return this.sortedMessages[0].timestamp;
    },
    maxTimestamp() {
      return this.sortedMessages[this.sortedMessages.length - 1].timestamp;
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
            conversationId: group[0].conversationId,
          };
        },
        // TODO might be better to do this by conv ID to avoid name collisions?
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
    conversationGroupIds() {
      return this.conversationsSummary
        .filter((c) => c.summary.conversationType === "RegularGroup")
        .map((c) => c.summary.conversationId);
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
    conversationDMIds() {
      return this.conversationsSummary
        .filter((c) => c.summary.conversationType === "Regular")
        .map((c) => c.summary.conversationId);
    },
  },
});
</script>
<style>
.count-by-conv-chart {
  width: 48%;
  height: 600px;
  overflow: auto;
  display: inline-block;
}
</style>
