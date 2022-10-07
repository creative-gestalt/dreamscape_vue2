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

export const sessionStore = defineStore("sessions", {
  state: () => ({
    sessions: [] as Session[],
    currentTab: 0,
  }),
  getters: {
    getSessions: (state: State): Session[] => state.sessions,
    getCurrentTab: (state: State): number => state.currentTab,
  },
  actions: {
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
    async updateCurrentTab(payload: number): Promise<void> {
      this.currentTab = payload;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
