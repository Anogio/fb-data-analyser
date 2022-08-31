<template>
  <div class="home">
    <analytics
      v-if="messages !== null && myName !== null"
      :messages="messages"
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
      messages: null,
      myName: null,
    };
  },
  methods: {
    handleUploadFinished(event) {
      this.messages = event.messages;
      this.myName = event.myName;
    },
  },
});
</script>
