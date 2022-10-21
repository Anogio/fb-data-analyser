<template>
  <div>Conversation {{ $route.params.id }}</div>
  <div
    v-for="(message, index) in convMessages"
    :key="index"
    class="message"
    :class="{ mine: message.mine }"
  >
    <div class="sender">
      {{ message.sender }} ({{ new Date(message.timestamp).toISOString() }})
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
          return { ...m, mine: m.sender === this.mainStore.myName };
        });
    },
  },
});
</script>
