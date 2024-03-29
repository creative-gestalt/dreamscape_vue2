import { defineStore } from "pinia";
import { Colors, Settings } from "@/interfaces/settings.interface";
import { sleep } from "@/utils/constants";
import { server } from "@/utils/server";
import axios from "axios";

export const useMainStore = defineStore("main", {
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
    gSettings: (state): Settings => state.settings,
    gColors: (state): Colors => state.settings.colors,
    gDate: () => (): string => {
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60 * 1000;
      const dateLocal = new Date(now.getTime() - offsetMs);
      return dateLocal.toISOString().slice(0, 19);
    },
    gLoading: (state): boolean => state.loading,
  },
  actions: {
    async reset(): Promise<void> {
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
      await axios.put(
        `${server.baseURL}/updateSettings/${this.settings._id}`,
        this.settings
      );
    },
    async getSettings(): Promise<void> {
      const settings = (await axios.get(`${server.baseURL}/getSettings`)).data;
      if (settings) this.settings = settings;
    },
    async updateSettings(): Promise<void> {
      if (!this.settings._id) {
        this.settings = (
          await axios.post(`${server.baseURL}/createSettings`, this.settings)
        ).data;
      } else {
        this.settings = (
          await axios.put(
            `${server.baseURL}/updateSettings/${this.settings._id}`,
            this.settings
          )
        ).data;
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
