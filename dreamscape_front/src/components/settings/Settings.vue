<template>
  <v-container>
    <v-card>
      <v-btn-toggle v-model="selectedColorButton" class="d-flex">
        <v-btn class="flex-grow-1" value="topBarColor">
          <v-icon :color="settings.colors.topBarColor">
            mdi-format-line-weight
          </v-icon>
        </v-btn>
        <v-btn class="flex-grow-1" value="backgroundColor">
          <v-icon :color="settings.colors.backgroundColor">
            mdi-application-outline
          </v-icon>
        </v-btn>
        <v-btn class="flex-grow-1" value="iconColor">
          <v-icon :color="settings.colors.iconColor">mdi-pill</v-icon>
        </v-btn>
        <v-btn class="flex-grow-1" value="textColor">
          <v-icon :color="settings.colors.textColor">mdi-text-shadow</v-icon>
        </v-btn>
        <v-btn class="flex-grow-1" value="completeBtnColor">
          <v-icon :color="settings.colors.completeBtnColor">
            mdi-gesture-tap
          </v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-color-picker
        v-model="settings.colors[selectedColorButton]"
        @update:color="updateColors"
      ></v-color-picker>
    </v-card>
    <v-divider class="mt-5"></v-divider>
    <v-row>
      <v-col>
        <v-btn @click="reset" class="mt-5" color="red darken-2" block>
          Reset
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Settings } from "@/interfaces/settings.interface";
import { useMainStore } from "@/stores/main";
import { mapState, mapStores } from "pinia";
import { useSessionStore } from "@/stores/sessions";

export default Vue.extend({
  name: "SettingsComponent",
  data: () => ({
    selectedColorButton: "topBarColor",
  }),
  methods: {
    async reset(): Promise<void> {
      await this.mainStore.reset();
    },
    updateColors(): void {
      this.mainStore.updateSettings();
    },
  },
  computed: {
    ...mapStores(useMainStore, useSessionStore),
    ...mapState(useMainStore, ["gColors"]),
    settings(): Settings {
      return this.mainStore.settings;
    },
    isMobile(): boolean {
      return this.$vuetify.breakpoint.name === "xs";
    },
  },
});
</script>
