import Vue from "vue";
import Vuex from "vuex";
import { Pagination, State } from "@/interfaces/state.interface";
import { Dream } from "@/interfaces/dream.interface";
import { Colors, Settings } from "@/interfaces/settings.interface";
import { Session } from "@/interfaces/session.interface";
import createPersistedState from "vuex-persistedstate";
import axios from "axios";
import { sleep } from "@/utils/constants";

Vue.use(Vuex);

const url = "http://192.168.1.250:3001";
// const url = "http://localhost:3000";

let user = "";
if (window.location.port === "8081" || window.location.port === "8080")
  user = "nick";
if (window.location.port === "8000") user = "lydia";
axios.defaults.headers.common = {
  "requested-from": user,
};

const initialState = () => ({
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
  loading: false,
  currentTab: 0,
});

export default new Vuex.Store({
  state: () => initialState(),
  mutations: {
    RESET(state: State) {
      state
    },
    // Dreams mutations
    SET_DREAMS(state: State, payload: Dream[]): void {
      state.dreams = payload;
    },
    SET_DREAMS_COUNT(state: State, payload: number): void {
      state.dreamsCount = payload;
    },
    ADD_DREAM(state: State, payload: Dream): void {
      state.dreams.push(payload);
    },
    SET_DREAM_DATES(state: State, payload: string[]): void {
      state.dates = payload;
    },
    // Sessions mutations
    SET_SESSIONS(state: State, payload: Session[]): void {
      state.sessions = payload;
    },
    LOAD_MORE_SESSIONS(state: State, payload: Session[]): void {
      for (let i = 0, n = payload.length; i < n; i++) {
        state.sessions.push(payload[i]);
      }
    },
    ADD_SESSION(state: State, payload: Session): void {
      state.sessions.push(payload);
    },
    // Settings mutations
    SET_SETTINGS(state: State, payload: Settings): void {
      if (payload) state.settings = payload;
    },
    UPDATE_LOADING(state: State, payload: boolean): void {
      state.loading = payload;
    },
    UPDATE_CURRENT_TAB(state: State, payload: number): void {
      state.currentTab = payload;
    },
  },
  actions: {
    async reset({ commit, state }, payload: Settings): Promise<void> {
      commit("RESET");
      await axios.put(`${url}/updateSettings/${payload._id}`, state.settings);
    },
    // Dreams requests
    async getDreamsCount({ commit }, payload: Pagination): Promise<void> {
      await axios
        .get(`${url}/getDreamsCount`)
        .then((data) => commit("SET_DREAMS_COUNT", data.data));
    },
    async getDreamsForPage({ commit }, payload: Pagination): Promise<void> {
      await axios
        .get(`${url}/getDreams/${payload.skip}-${payload.limit}`)
        .then((data) => commit("SET_DREAMS", data.data));
    },
    async getDream({ commit }, payload: Dream): Promise<void> {
      return await axios
        .get(`${url}/getDream/${payload._id}`)
        .then((result) => result.data);
    },
    async searchDreams({ commit }, payload: string): Promise<void> {
      await axios
        .get(`${url}/searchDreams?target=${payload}`)
        .then((result) => {
          commit("SET_DREAMS_COUNT", result.data.count);
          commit("SET_DREAMS", result.data.dreams);
        });
    },
    async addDream({ commit }, payload: Dream): Promise<void> {
      await axios.post(`${url}/addDream`, payload);
    },
    async updateDream({ commit }, payload: Dream): Promise<void> {
      return await axios.put(
        `${url}/updateDream?dreamID=${payload._id}`,
        payload
      );
    },
    async deleteDreams({ commit }, payload: Dream[]): Promise<void> {
      await axios.post(`${url}/deleteDreams`, payload);
    },
    async getDreamDates({ commit }): Promise<void> {
      await axios
        .get(`${url}/getDreamDates`)
        .then((result) => commit("SET_DREAM_DATES", result.data));
    },
    // Sessions requests
    async getAllSessions({ commit, state }): Promise<void> {
      await axios
        .get(`${url}/getSessions/0-${state.limit}`)
        .then((data) => commit("SET_SESSIONS", data.data));
    },
    async loadMoreSessions(
      { commit },
      payload: Record<string, string>
    ): Promise<void> {
      await axios
        .get(`${url}/getSessions/${payload.skip}-${payload.limit}`)
        .then((data) => commit("LOAD_MORE_SESSIONS", data.data));
    },
    async getSession({ commit }, payload: Session): Promise<void> {
      return await axios
        .get(`${url}/getSession/${payload._id}`)
        .then((result) => result.data);
    },
    async addSession({ commit }, payload: Session): Promise<void> {
      const newPayload = { ...payload };
      newPayload.user = user;
      await axios.post(`${url}/addSession`, newPayload);
    },
    async updateSession({ commit }, payload: Session): Promise<void> {
      return await axios.put(
        `${url}/updateSession?sessionID=${payload._id}`,
        payload
      );
    },
    async deleteSessions({ commit }, payload: Session[]): Promise<void> {
      await axios.post(`${url}/deleteSessions`, payload);
    },
    // Settings requests
    async getSettings({ commit }): Promise<void> {
      const settings = (await axios.get(`${url}/getSettings`)).data;
      if (settings) commit("SET_SETTINGS", settings);
    },
    async updateSettings({ commit }, payload: Settings): Promise<void> {
      if (!payload._id) {
        const settings = (await axios.post(`${url}/createSettings`, payload))
          .data[0];
        commit("SET_SETTINGS", settings);
      } else {
        const settings = (
          await axios.put(`${url}/updateSettings/${payload._id}`, payload)
        ).data[0];
        commit("SET_SETTINGS", settings);
      }
    },
    async updateLoading({ commit }, payload: boolean): Promise<void> {
      if (payload) {
        commit("UPDATE_LOADING", payload);
      } else {
        await sleep(750);
        commit("UPDATE_LOADING", payload);
      }
    },
    async updateCurrentTab({ commit }, payload: number): Promise<void> {
      commit("UPDATE_CURRENT_TAB", payload);
    },
  },
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
    loading: (state: State): boolean => state.loading,
    getCurrentTab: (state: State): number => state.currentTab,
  },
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
