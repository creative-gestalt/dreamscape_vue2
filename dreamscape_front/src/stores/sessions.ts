import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPinia, defineStore } from "pinia";
import { Session } from "@/interfaces/session.interface";
import axios from "axios";

export const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const url = process.env.SERVER_ADDRESS;
console.log(url);
axios.defaults.headers.common = { "requested-from": process.env.APP_USER };

export const sessionStore = defineStore("sessions", {
  state: () => ({
    limit: 40,
    sessions: [] as Session[],
    currentTab: 0,
  }),
  getters: {
    gSessions: (state): Session[] => state.sessions,
    gCurrentTab: (state): number => state.currentTab,
  },
  actions: {
    async getAllSessions(): Promise<void> {
      await axios
        .get(`${url}/getSessions/0-${this.limit}`)
        .then((data) => (this.sessions = data.data));
    },
    async loadMoreSessions(payload: Record<string, number>): Promise<void> {
      await axios
        .get(`${url}/getSessions/${payload.skip}-${payload.limit}`)
        .then((data) => {
          for (let i = 0, n = data.data.length; i < n; i++) {
            this.sessions.push(data.data[i]);
          }
        });
    },
    async getSession(payload: Session): Promise<Session> {
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
