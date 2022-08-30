<template>
  <div>
    TODO: some explanation about the project
    <br />
    You can get the file by following
    <a href="https://www.facebook.com/help/212802592074644" target="_blank"
      >these instructions</a
    >
    <br /><br />
    <input type="file" id="file" class="inputfile" @change="checkFile" />
    <label for="file" class="input-file-button">Pick a file</label>
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
      finished: false,
    };
  },
  methods: {
    async checkFile(e) {
      console.log("Starting import");
      const files = e.target.files;

      // TODO: there seems to be an issue here with content encoding:
      //       some characters are badly decoded (in names or message content)
      //       Ex: "je sais pas d'oÃ¹ sort" -> the ù became Ã¹
      const zipContent = await this.getEntries(files[0], {
        filenameEncoding: "utf-8",
      });

      const profileFile = zipContent.filter((f) =>
        f.filename.endsWith("profile_information.json")
      )[0];
      const myProfile = await profileFile.getData(new zip.TextWriter());
      const myName = JSON.parse(this.fixEncoding(myProfile)).profile_v2.name
        .full_name;

      const conversationFiles = zipContent.filter(
        (f) =>
          f.filename.match(/messages\/inbox\/.*\/message_\d+\.json/g) !== null
      );

      var messages = await Promise.all(
        conversationFiles.map(async (f) => {
          const fileContent = await f.getData(new zip.TextWriter());
          const conversation = JSON.parse(this.fixEncoding(fileContent));
          if (conversation.participants.length <= 1) {
            // These are DMs where you are unfriended with the person, or group chats where
            // everybody left. We choose to exclude them
            return [];
          }
          // TODO: this would be so much better with Typescript
          return conversation.messages.map((message) => {
            return {
              conversationName: conversation.title,
              conversationId: conversation.thread_path,
              conversationType: conversation.thread_type, // Usually Regular for DMs or RegularGroup for others
              sender: message.sender_name,
              timestamp: message.timestamp_ms,
              text: message.content,
            };
          });
        })
      );
      messages = messages.flat();
      this.$emit("uploaded", { messages: messages, myName: myName });
      console.log(
        "Imported file with ",
        messages.length,
        "messages for user ",
        myName
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
  display: block;
  padding: 6px 12px;
  cursor: pointer;
}
</style>
