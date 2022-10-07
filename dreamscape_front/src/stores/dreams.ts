import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPinia, defineStore } from "pinia";
import { Pagination, State } from "@/interfaces/state.interface";
import { Dream } from "@/interfaces/dream.interface";
import { Colors, Settings } from "@/interfaces/settings.interface";
import { Session } from "@/interfaces/session.interface";
import axios from "axios";
import { sleep } from "@/utils/constants";

export const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const url = process.env.SERVER_ADDRESS;

export const dreamStore = defineStore("dreams", {
  state: () => ({
    limit: 40,
    dreams: [] as Dream[],
    dates: [] as string[],
    dreamsCount: 0,
    currentTab: 0,
  }),
  getters: {
    getDreams: (state: State): Dream[] => state.dreams,
    getDreamsCount: (state: State): number => state.dreamsCount,
    getDreamDates: (state: State): string[] => state.dates,
    getCurrentTab: (state: State): number => state.currentTab,
  },
  actions: {
    async getDreamsCount(payload: Pagination): Promise<void> {
      await axios
        .get(`${url}/getDreamsCount`)
        .then((data) => (this.dreamsCount = data.data));
    },
    async getDreamsForPage(payload: Pagination): Promise<void> {
      await axios
        .get(`${url}/getDreams/${payload.skip}-${payload.limit}`)
        .then((data) => (this.dreams = data.data));
    },
    async getDream(payload: Dream): Promise<void> {
      return await axios
        .get(`${url}/getDream/${payload._id}`)
        .then((result) => result.data);
    },
    async searchDreams(payload: string): Promise<void> {
      await axios
        .get(`${url}/searchDreams?target=${payload}`)
        .then((result) => {
          this.dreamsCount = result.data.count;
          this.dreams = result.data.dreams;
        });
    },
    async addDream(payload: Dream): Promise<void> {
      await axios.post(`${url}/addDream`, payload);
    },
    async updateDream(payload: Dream): Promise<void> {
      return await axios.put(
        `${url}/updateDream?dreamID=${payload._id}`,
        payload
      );
    },
    async deleteDreams(payload: Dream[]): Promise<void> {
      await axios.post(`${url}/deleteDreams`, payload);
    },
    async updateCurrentTab(payload: number): Promise<void> {
      this.currentTab = payload;
    },
    async getDreamDates(): Promise<void> {
      await axios
        .get(`${url}/getDreamDates`)
        .then((result) => (this.dates = result.data));
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
