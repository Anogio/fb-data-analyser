import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Advanced from "../views/Advanced.vue";
import Conversation from "../views/Conversation.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/conversation/:id(.*)",
    name: "Conversation",
    component: Conversation,
  },
  {
    path: "/advanced",
    name: "Advanced",
    component: Advanced,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
