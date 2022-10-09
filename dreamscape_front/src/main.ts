import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { pinia } from "./plugins/pinia";
import { alphaToHex } from "@/utils/constants";
import "./registerServiceWorker";

Vue.config.productionTip = false;
document.title = "Dreamscape";

Vue.filter(
  "truncate",
  function (text: string, stop: number, clamp = "..."): string {
    return text.slice(0, stop) + (stop < text.length ? clamp || "..." : "");
  }
);

Vue.filter(
  "alpha",
  function (hex: string, percentage: string, style = false, attr = ""): string {
    percentage = String(percentage);
    hex = String(hex).slice(0, 7);
    if (style) return `${attr}: ${hex + alphaToHex[percentage]}`;
    return hex + alphaToHex[percentage];
  }
);

new Vue({
  router,
  pinia,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
