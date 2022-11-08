<template>
  <div>
    <n-button @click="goToHome">Go back</n-button>
    <div v-if="!loaded && !loading">
      We need to load the messages into an in-memory database before you can
      query the messages.
      <br />
      Click this button to get started, it can take a few minutes depending on
      the volume of messages.
      <br />
      <n-button @click="startLoad" type="info">Start load</n-button>
    </div>
    <div v-else-if="loading">
      Loading... This can take a few minutes
      <br />
      {{ nRows }} / {{ mainStore.sortedMessages.length }}
    </div>
    <div v-else>
      <n-input
        v-model:value="SQLQuery"
        v-on:keyup.enter="runQuery"
        placeholder="Type a SQLite query. Example: 'SELECT * FROM messages LIMIT 1;"
      />
      <n-button @click="runQuery">Run query</n-button>
      <div v-if="result">
        Result:
        <json-viewer :value="result" />
      </div>
      <div v-else-if="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import initSqlJs from "sql.js";
import { mapStores } from "pinia";
import { useMainStore } from "@/store";
// Required to let webpack 4 know it needs to copy the wasm file to our assets
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";

export default defineComponent({
  name: "Advanced",
  async created() {
    if (!this.mainStore.sortedMessages) {
      this.goToHome();
    }
    const SQL = await initSqlJs({ locateFile: () => sqlWasm });
    this.db = new SQL.Database();
  },
  data() {
    return {
      nRows: 0,
      loaded: false,
      loading: false,
      SQLQuery: "SELECT * FROM messages LIMIT 1;",
      result: "",
      error: null,
      db: null,
    };
  },
  computed: {
    ...mapStores(useMainStore),
  },
  methods: {
    goToHome() {
      this.$router.push("/");
    },
    runQuery() {
      this.result = null;
      try {
        this.result = this.db.exec(this.SQLQuery)[0];
      } catch (error) {
        this.error = error;
        console.log(error);
      }
    },
    async startLoad() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.db.run(
        "CREATE TABLE messages (conversationName TEXT, conversationId TEXT, conversationType TEXT," +
          "timestampMs INTEGER, sender TEXT, text TEXT, photos TEXT, reactions TEXT);"
      );
      this.mainStore.sortedMessages.forEach((msg) => {
        let insertStmt = `INSERT INTO messages (conversationName, conversationId, conversationType, timestampMs, sender, text, photos, reactions)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        let binding = [
          msg.conversationName,
          msg.conversationId,
          msg.conversationType,
          msg.timestamp,
          msg.sender,
          msg.text ? msg.text : "",
          JSON.stringify(msg.photos),
          msg.reactions ? JSON.stringify(msg.reactions) : null,
        ];
        this.db.run(insertStmt, binding);
        this.nRows += 1;
        console.log(this.nRows);
      });
      this.loaded = true;
      this.loading = false;
    },
  },
});
</script>
