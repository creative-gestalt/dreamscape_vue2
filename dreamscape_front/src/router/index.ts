import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import DreamsPage from "@/views/DreamsPage.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/"
  },
  {
    path: "/dreams",
    name: "DreamsPage",
    component: DreamsPage,
    meta: {
      title: "Dreams",
    },
  },
  {
    path: "/sessions",
    name: "SessionPage",
    component: () =>
      import(/* webpackChunkName: "sessions" */ "../views/SessionsPage.vue"),
    meta: {
      title: "Sessions",
    },
  },
  {
    path: "/dream/:id",
    name: "ViewDreamPage",
    component: () =>
      import(/* webpackChunkName: "view-dream" */ "../views/ViewDreamPage.vue"),
    meta: {
      title: "View Dream",
    },
  },
  {
    path: "/session/:id",
    name: "ViewSessionPage",
    component: () =>
      import(
        /* webpackChunkName: "view-session" */ "../views/ViewSessionPage.vue"
      ),
    meta: {
      title: "View Session",
    },
  },
  {
    path: "/dream-overview",
    name: "DreamOverviewPage",
    component: () =>
      import(
        /* webpackChunkName: "overview" */ "../views/DreamOverviewPage.vue"
      ),
    meta: {
      title: "Overview",
    },
  },
  {
    path: "/settings",
    name: "SettingsPage",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/SettingsPage.vue"),
    meta: {
      title: "Settings",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
