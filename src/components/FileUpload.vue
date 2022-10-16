<template>
  <div :style="{ width: '75%' }">
    <h1>Hi!</h1>
    <div>
      This page is designed to give you some
      <b>analytics about you Facebook Messenger</b> conversation data.
      <br />
      It
      <b>does not send any data through the network</b>: everything happens on
      your computer.
      <br />
      You don't have to trust me, feel free to disconnect from the internet
      before uploading your data ;)
    </div>
    <br />
    You can get the file by following
    <a href="https://www.facebook.com/help/212802592074644" target="_blank"
      >these instructions</a
    >. It may take a few days to generate.
    <br />
    NB: Facebook might propose multiple files for download. Only one of them will have messages in it,
    the rest are overflow files that will mostly contain files that were too big to fit in the archive.
    However, it's unclear how you can tell which one is the right file, you'll have to try them one by one.
    <br />
    <div v-if="!loading">
      <input
        type="file"
        id="file"
        class="inputfile"
        @change="checkFile"
        accept=".zip"
      />
      <label for="file" class="input-file-button"><b>Pick a file</b></label>
    </div>
    <div v-else>
      <b
        >Please wait while your data is processed... ({{
          processedConversations
        }}
        / {{ totalConversations }} conversations processed)</b
      >
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import * as zip from "@zip.js/zip.js";
import * as iconv from "iconv-lite";

export default defineComponent({
  name: "FileUpload",
  data() {
    return {
      loading: false,
      totalConversations: null,
      processedConversations: null,
    };
  },
  methods: {
    async checkFile(e) {
      this.loading = true;
      console.log("Starting import");
      const files = e.target.files;

      // TODO: there seems to be an issue here with content encoding:
      //       some characters are badly decoded (in names or message content)
      //       Ex: "je sais pas d'oÃ¹ sort" -> the ù became Ã¹
      const zipContent = await this.getEntries(files[0], {
        filenameEncoding: "utf-8",
      });

      const profileFiles = zipContent.filter((f) =>
        f.filename.endsWith("profile_information.json")
      );
      let myName = null;
      if (profileFiles.length > 0) {
        const profileFile = profileFiles[0];
        const myProfile = await profileFile.getData(new zip.TextWriter());
        myName = JSON.parse(this.fixEncoding(myProfile)).profile_v2.name
          .full_name;
      }

      const conversationFiles = zipContent.filter(
        (f) =>
          f.filename.match(/messages\/inbox\/.*\/message_\d+\.json/g) !== null
      );

      this.totalConversations = conversationFiles.length;
      this.processedConversations = 0;

      var messages = await Promise.all(
        conversationFiles.map(async (f) => {
          const fileContent = await f.getData(new zip.TextWriter());
          const conversation = JSON.parse(this.fixEncoding(fileContent));
          if (conversation.participants.length <= 1) {
            // These are DMs where you are unfriended with the person, or group chats where
            // everybody left. We choose to exclude them
            this.processedConversations += 1;
            return [];
          }
          // TODO: this would be so much better with Typescript
          const result = conversation.messages.map((message) => {
            return {
              conversationName: conversation.title,
              conversationId: conversation.thread_path,
              conversationType: conversation.thread_type, // Usually Regular for DMs or RegularGroup for others
              sender: message.sender_name,
              timestamp: message.timestamp_ms,
              text: message.content,
            };
          });
          this.processedConversations += 1;
          return result;
        })
      );
      messages = messages.flat();
      messages.sort((m1, m2) => m1.timestamp - m2.timestamp);

      let names = null;
      if (myName === null) {
        names = new Map();
        messages.forEach((m) =>
          names.set(m.sender, (names.get(m.sender) || 0) + 1)
        );
        names = Array.from(names.entries()).sort((a, b) => b[1] - a[1]);
        names = names.map((e) => e[0]);
      }

      this.loading = false;
      this.$emit("uploaded", {
        sortedMessages: messages,
        myName: myName,
        names: names,
      });
      console.log(
        "Imported file with ",
        messages.length,
        "messages for user ",
        myName,
        "with names",
        names
      );
    },

    async getEntries(file, options) {
      return await new zip.ZipReader(new zip.BlobReader(file)).getEntries(
        options
      );
    },
    fixEncoding(text) {
      return iconv.decode(
        iconv.encode(JSON.stringify(JSON.parse(text)), "ISO-8859-1"),
        "utf8"
      );
    },
  },
});
</script>

<style scoped>
.inputfile {
  display: none;
}
.input-file-button {
  border: 1px solid #ccc;
  border-radius: 10px;
  display: block;
  padding: 6px 12px;
  cursor: pointer;
  background-color: lightGreen;
  width: 300px;
  text-align: center;
}
</style>
