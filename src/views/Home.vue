<template>
  <div class="home">
    <analytics
      v-if="sortedMessages !== null"
      :sortedMessages="sortedMessages"
      :my-name="myName"
    />
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
    };
  },
  methods: {
    handleUploadFinished(event) {
      this.sortedMessages = event.sortedMessages;
      this.myName = event.myName;
    },
  },
});
</script>
