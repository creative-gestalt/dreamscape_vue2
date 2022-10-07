import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPinia, defineStore } from "pinia";
import { Colors, Settings } from "@/interfaces/settings.interface";
import { sleep } from "@/utils/constants";
import axios from "axios";

export const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const url = process.env.SERVER_ADDRESS;
axios.defaults.headers.common = { "requested-from": process.env.APP_USER };

export const mainStore = defineStore("main", {
  state: () => ({
    settings: {
      colors: {
        topBarColor: "#333333",
        backgroundColor: "#111111",
        iconColor: "#000000",
        textColor: "#fff",
        completeBtnColor: "#007707",
      },
    } as Settings,
    loading: false,
  }),
  getters: {
    getSettings: (state): Settings => state.settings,
    getColors: (state): Colors => state.settings.colors,
    getDate: () => (): string => {
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60 * 1000;
      const dateLocal = new Date(now.getTime() - offsetMs);
      return dateLocal.toISOString().slice(0, 19);
    },
    getLoading: (state): boolean => state.loading,
  },
  actions: {
    async reset(payload: Settings): Promise<void> {
      this.settings = {
        _id: this.settings._id,
        colors: {
          topBarColor: "#333333",
          backgroundColor: "#111111",
          iconColor: "#000000",
          textColor: "#fff",
          completeBtnColor: "#007707",
        },
      };
      await axios.put(`${url}/updateSettings/${payload._id}`, this.settings);
    },
    async getSettings(): Promise<void> {
      const settings = (await axios.get(`${url}/getSettings`)).data;
      if (settings) this.settings = settings;
    },
    async updateSettings(payload: Settings): Promise<void> {
      if (!payload._id) {
        this.settings = (
          await axios.post(`${url}/createSettings`, payload)
        ).data[0];
      } else {
        this.settings = (
          await axios.put(`${url}/updateSettings/${payload._id}`, payload)
        ).data[0];
      }
    },
    async updateLoading(payload: boolean): Promise<void> {
      if (payload) {
        this.loading = payload;
      } else {
        await sleep(750);
        this.loading = payload;
      }
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
