<template>
  <div class="home">
    <analytics
      v-if="sortedMessages !== null && myName !== null"
      :sortedMessages="sortedMessages"
      :my-name="myName"
    />
    <div v-else-if="sortedMessages !== null">
      <span>Profile file not found, please select your name:</span>
      <select name="MyName" v-model="selectedName">
        <option v-for="name in names" :key="name" :value="name">
          {{ name }}
        </option>
      </select>
      <button @click="setName">ok</button>
    </div>
    <file-upload v-else v-on:uploaded="handleUploadFinished" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import FileUpload from "@/components/FileUpload.vue";
import Analytics from "@/components/Analytics.vue";

export default defineComponent({
  name: "Home",
  components: {
    FileUpload,
    Analytics,
  },
  data() {
    return {
      sortedMessages: null,
      myName: null,
      selectedName: null,
      names: [],
    };
  },
  methods: {
    handleUploadFinished(event) {
      this.sortedMessages = event.sortedMessages;
      this.myName = event.myName;
      this.names = event.names;
    },
    setName() {
      this.myName = this.selectedName;
    }
  },
});
</script>
