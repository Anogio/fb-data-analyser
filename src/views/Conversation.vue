<template>
  <div>Conversation {{ $route.params.id }}</div>
  <!-- TODO this key is bad -->
  <div
    v-for="message in convMessages"
    :key="message.idx"
    class="message"
    :class="message.mine ? 'mine' : 'other'"
  >
    <div class="sender">
      {{ message.sender }} ({{ new Date(message.timestamp).toISOString() }})
    </div>
    <div class="contents">
      {{ message.text }}
    </div>
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
</style>

<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/store";

export default defineComponent({
  name: "Conversations",
  data() {
    return {};
  },
  computed: {
    ...mapStores(useMainStore),
    convMessages() {
      return this.mainStore.sortedMessages
        .filter((m) => m.conversationId === this.$route.params.id)
        .map((m, idx) => {
          return { ...m, idx: idx, mine: m.sender === this.mainStore.myName };
        });
    },
  },
});
</script>
