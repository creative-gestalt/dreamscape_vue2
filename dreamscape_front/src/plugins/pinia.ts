import Vue from "vue";
import vueCompositionApi from "@vue/composition-api";
import { createPinia, PiniaVuePlugin } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

Vue.use(vueCompositionApi);
Vue.use(PiniaVuePlugin);
const initPinia = createPinia();
initPinia.use(piniaPluginPersistedstate);

export const pinia = initPinia;
