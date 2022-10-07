import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import vueCompositionApi from "@vue/composition-api";
import { alphaToHex } from "@/utils/constants";
import { createPinia, PiniaVuePlugin } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

Vue.config.productionTip = false;
document.title = "Dreamscape";

Vue.use(vueCompositionApi);
Vue.use(PiniaVuePlugin);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

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
