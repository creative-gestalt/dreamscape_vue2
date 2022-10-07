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
    dreamsCount: 0,
    dates: [] as string[],
    sessions: [] as Session[],
    settings: {
      colors: {
        topBarColor: "#333333",
        backgroundColor: "#111111",
        iconColor: "#000000",
        textColor: "#fff",
        completeBtnColor: "#007707",
      },
    } as Settings,
    currentTab: 0,
  }),
  getters: {
    getDreams: (state: State): Dream[] => state.dreams,
    getDreamsCount: (state: State): number => state.dreamsCount,
    getSessions: (state: State): Session[] => state.sessions,
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
    getDreamDates: (state: State): string[] => state.dates,
    getCurrentTab: (state: State): number => state.currentTab,
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
    // Dreams requests
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
    async getDreamDates(): Promise<void> {
      await axios
        .get(`${url}/getDreamDates`)
        .then((result) => (this.dates = result.data));
    },
    // Sessions requests
    async getAllSessions(): Promise<void> {
      await axios
        .get(`${url}/getSessions/0-${this.limit}`)
        .then((data) => (this.sessions = data.data));
    },
    async loadMoreSessions(payload: Record<string, string>): Promise<void> {
      await axios
        .get(`${url}/getSessions/${payload.skip}-${payload.limit}`)
        .then((data) => {
          for (let i = 0, n = data.data.length; i < n; i++) {
            this.sessions.push(data.data[i]);
          }
        });
    },
    async getSession(payload: Session): Promise<void> {
      return await axios
        .get(`${url}/getSession/${payload._id}`)
        .then((result) => result.data);
    },
    async addSession(payload: Session): Promise<void> {
      await axios.post(`${url}/addSession`, payload);
    },
    async updateSession(payload: Session): Promise<void> {
      return await axios.put(
        `${url}/updateSession?sessionID=${payload._id}`,
        payload
      );
    },
    async deleteSessions(payload: Session[]): Promise<void> {
      await axios.post(`${url}/deleteSessions`, payload);
    },
    // Settings requests
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
    async updateCurrentTab(payload: number): Promise<void> {
      this.currentTab = payload;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
