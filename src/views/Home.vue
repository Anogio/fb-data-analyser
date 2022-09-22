<template>
  <div class="home">
    <analytics
      v-if="mainStore.sortedMessages !== null && mainStore.myName !== null"
      :sortedMessages="mainStore.sortedMessages"
      :my-name="mainStore.myName"
    />
    <div v-else-if="mainStore.sortedMessages !== null">
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
import { mapStores } from "pinia";
import FileUpload from "@/components/FileUpload.vue";
import Analytics from "@/components/Analytics.vue";
import { useMainStore } from "@/store";

export default defineComponent({
  name: "Home",
  components: {
    FileUpload,
    Analytics,
  },
  data() {
    return {
      selectedName: null,
      names: [],
    };
  },
  methods: {
    handleUploadFinished(event) {
      this.names = event.names;
    },
    setName() {
      this.myName = this.selectedName;
    },
  },
  computed: mapStores(useMainStore),
});
</script>
