import naive from "naive-ui";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(naive);
app.use(pinia);
app.mount("#app");
