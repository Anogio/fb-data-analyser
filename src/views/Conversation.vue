<template>
  <div class="conversation">
    <n-button @click="goToHome">Go back</n-button>
    <div>
      <b>Conversation {{ convName }}</b>
    </div>
    <n-tabs type="segment">
      <n-tab-pane name="analytics" tab="Analytics">
        Coucou
        <LineChart
          :chartData="conversationTimelineChartData"
          title="Monthly messages"
          class="monthly-messages-chart"
        />
      </n-tab-pane>
      <n-tab-pane name="messages" tab="Messages">
        <div
          v-for="(message, index) in filteredConvMessages"
          :key="index"
          class="message"
          :class="{ mine: message.mine }"
        >
          <div class="sender">
            {{ message.sender }} ({{
              new Date(message.timestamp).toISOString()
            }})
          </div>
          <div class="contents">
            {{ message.text }}
          </div>
          <div class="reacts">
            <span v-for="(reaction, index) in message.reactions" :key="index">
              <span v-if="index !== 0">, </span>
              {{ reaction.reaction }} {{ reaction.actor }}
            </span>
          </div>
        </div>
        <n-button
          v-if="limit < convMessages.length"
          @click="limit = limit + 10000"
          >Show more</n-button
        >
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>
.sender {
  color: gray;
  font-size: 80%;
}

.message {
  margin-bottom: 0.5em;
}

.mine {
  text-align: right;
}

.reacts {
  font-size: 80%;
}
</style>

<script>
import LineChart from "@/components/LineChart.vue";

import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/store";
import * as d3 from "d3";

export default defineComponent({
  name: "Conversations",
  components: { LineChart },
  data() {
    return {
      limit: 10000,
    };
  },
  created() {
    if (!this.mainStore.sortedMessages) {
      this.goToHome();
    }
  },
  computed: {
    ...mapStores(useMainStore),
    convMessages() {
      return this.mainStore.sortedMessages
        .filter((m) => m.conversationId === this.$route.params.id)
        .map((m, idx) => {
          return { ...m, mine: m.sender === this.mainStore.myName };
        });
    },
    filteredConvMessages() {
      return this.convMessages.slice(0, this.limit);
    },
    convName() {
      return this.convMessages[0].conversationName;
    },
    messageCountsByMonth() {
      const messageCounts = d3.rollup(
        this.convMessages,
        (group) => {
          const myMessages = group.filter(
            (message) => message.sender === this.mainStore.myName
          );
          return {
            sent: myMessages.length,
            received: group.length - myMessages.length,
          };
        },
        (m) => {
          const date = new Date(m.timestamp);
          return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
        }
      );

      const data = [];
      messageCounts.forEach((value, key) => {
        data.push({ monthTimestamp: key, summary: value });
      });
      return data;
    },
    conversationTimelineChartData() {
      return {
        labels: this.messageCountsByMonth.map((c) => c.monthTimestamp),
        datasets: [
          {
            data: this.messageCountsByMonth.map((c) => c.summary.sent),
            label: "Sent messages",
            backgroundColor: "lightBlue",
          },
          {
            data: this.messageCountsByMonth.map((c) => c.summary.received),
            label: "Received messages",
            backgroundColor: "lightRed",
          },
        ],
      };
    },
  },
  methods: {
    goToHome() {
      this.$router.push("/");
    },
  },
});
</script>

<style>
.conversation {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
