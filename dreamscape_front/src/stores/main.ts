import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPinia, defineStore } from "pinia";
import { State } from "@/interfaces/state.interface";
import { Colors, Settings } from "@/interfaces/settings.interface";
import { sleep } from "@/utils/constants";
import axios from "axios";

export const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const url = process.env.SERVER_ADDRESS;

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
    getSettings: (state: State): Settings => state.settings,
    getColors: (state: State): Colors => state.settings.colors,
    getDate: () => (): string => {
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60 * 1000;
      const dateLocal = new Date(now.getTime() - offsetMs);
      return dateLocal.toISOString().slice(0, 19);
    },
    getYears: (state: State): string[] => {
      return [
        ...new Set([...state.dates].map((date: string) => date.slice(0, 4))),
      ]
        .sort()
        .reverse();
    },
    getLoading: (state: State): boolean => state.loading,
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
