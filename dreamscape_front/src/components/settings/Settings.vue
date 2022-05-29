<template>
  <v-container>
    <div>
      <v-row>
        <v-col cols="12">
          <div class="pb-2" :style="{ color: getColors.textColor }">
            App Bars & Card Color
            <v-badge
              class="ml-3 float-right"
              :color="settings.colors.topBarColor"
              bordered
              inline
            ></v-badge>
          </div>
          <v-color-picker
            v-model="settings.colors.topBarColor"
            width=""
            :swatches-max-height="isMobile ? 200 : 175"
            show-swatches
            hide-canvas
            hide-sliders
            hide-inputs
          ></v-color-picker>
        </v-col>
        <v-col cols="12">
          <div class="pb-2" :style="{ color: getColors.textColor }">
            Background Color
            <v-badge
              class="ml-3 float-right"
              :color="settings.colors.backgroundColor"
              bordered
              inline
            ></v-badge>
          </div>
          <v-color-picker
            v-model="settings.colors.backgroundColor"
            width=""
            :swatches-max-height="isMobile ? 200 : 175"
            show-swatches
            hide-canvas
            hide-sliders
            hide-inputs
          ></v-color-picker>
        </v-col>
        <v-col cols="12">
          <div class="pb-2" :style="{ color: getColors.textColor }">
            Icon Color
            <v-badge
              class="ml-3 float-right"
              :color="settings.colors.iconColor"
              bordered
              inline
            ></v-badge>
          </div>
          <v-color-picker
            v-model="settings.colors.iconColor"
            width=""
            :swatches-max-height="isMobile ? 200 : 175"
            show-swatches
            hide-canvas
            hide-sliders
            hide-inputs
          ></v-color-picker>
        </v-col>
        <v-col cols="12">
          <div class="pb-2" :style="{ color: getColors.textColor }">
            Text Color
            <v-badge
              class="ml-3 float-right"
              :color="settings.colors.textColor"
              bordered
              inline
            ></v-badge>
          </div>
          <v-color-picker
            v-model="settings.colors.textColor"
            width=""
            :swatches-max-height="isMobile ? 200 : 175"
            show-swatches
            hide-canvas
            hide-sliders
            hide-inputs
          ></v-color-picker>
        </v-col>
        <v-col cols="12">
          <div class="pb-2" :style="{ color: getColors.textColor }">
            Complete Button Color
            <v-badge
              class="ml-3 float-right"
              :color="settings.colors.completeBtnColor"
              bordered
              inline
            ></v-badge>
          </div>
          <v-color-picker
            v-model="settings.colors.completeBtnColor"
            width=""
            :swatches-max-height="isMobile ? 200 : 175"
            show-swatches
            hide-canvas
            hide-sliders
            hide-inputs
          ></v-color-picker>
        </v-col>
      </v-row>
    </div>
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
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "Settings",
  data: () => ({
    //
  }),
  methods: {
    async reset(): Promise<void> {
      await this.$store.dispatch("reset", this.settings);
    },
  },
  computed: {
    ...mapGetters(["getSettings", "getColors"]),
    settings(): Settings {
      return this.getSettings;
    },
    isMobile(): boolean {
      return this.$vuetify.breakpoint.name === "xs";
    },
  },
  watch: {
    settings: {
      async handler(value: Settings): Promise<void> {
        await this.$store.dispatch("updateSettings", value);
      },
      deep: true,
    },
  },
});
</script>
