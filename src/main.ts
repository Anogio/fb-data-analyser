import naive from "naive-ui";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JsonViewer from "vue-json-viewer";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();

const app = createApp(App);
app.use(JsonViewer);
app.use(router);
app.use(naive);
app.use(pinia);
app.mount("#app");
