import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import PlayerPage from "../views/PlayerPage.vue";
import SettingsPage from "../views/SettingsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/player",
    name: "Player",
    component: PlayerPage,
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
