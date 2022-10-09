<template>
  <v-app id="app" :style="{ background: gColors.backgroundColor }">
    <v-app-bar :color="gColors.topBarColor" dark app>
      <div class="d-flex align-center pr-5">
        <v-img class="ml-3" width="35" src="@/assets/ga-logo-black.png"></v-img>
      </div>
      <v-app-bar-title
        class="text-no-wrap"
        :style="{
          color: gColors.iconColor,
        }"
      >
        {{ $route.meta.title }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div v-if="!isMobile">
        <v-btn to="/dreams" text>
          <v-icon :color="gColors.iconColor"> mdi-sleep </v-icon>
        </v-btn>
        <v-btn to="/sessions" text>
          <v-icon :color="gColors.iconColor"> mdi-notebook </v-icon>
        </v-btn>
        <v-btn to="/dream-overview" text>
          <v-icon :color="gColors.iconColor">mdi-calendar</v-icon>
        </v-btn>
        <v-btn to="/settings" text>
          <v-icon :color="gColors.iconColor"> mdi-cog-outline </v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <v-overlay v-if="gLoading" class="ma-auto ios-overlay">
        <v-progress-circular size="45" indeterminate></v-progress-circular>
      </v-overlay>
      <router-view />
    </v-main>

    <v-bottom-navigation
      v-if="isMobile"
      :background-color="gColors.topBarColor"
      grow
      shift
      app
    >
      <v-btn
        :height="bottomNavHeight"
        :color="gColors.topBarColor"
        to="/dreams"
      >
        <span :style="{ color: gColors.iconColor }"> Dreams </span>
        <v-icon :color="gColors.iconColor">mdi-sleep</v-icon>
      </v-btn>
      <v-btn
        :height="bottomNavHeight"
        :color="gColors.topBarColor"
        to="/sessions"
      >
        <span :style="{ color: gColors.iconColor }"> Sessions </span>
        <v-icon :color="gColors.iconColor"> mdi-notebook </v-icon>
      </v-btn>
      <v-btn
        :height="bottomNavHeight"
        :color="gColors.topBarColor"
        to="/dream-overview"
      >
        <span :style="{ color: gColors.iconColor }"> Overview </span>
        <v-icon :color="gColors.iconColor"> mdi-calendar </v-icon>
      </v-btn>
      <v-btn
        :height="bottomNavHeight"
        :color="gColors.topBarColor"
        to="/settings"
      >
        <span :style="{ color: gColors.iconColor }"> Settings </span>
        <v-icon :color="gColors.iconColor"> mdi-cog-outline </v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";
import { useSessionStore } from "@/stores/sessions";
import { mapActions, mapState } from "pinia";

export default Vue.extend({
  name: "App",
  async mounted(): Promise<void> {
    await this.getSettings();
  },
  async created(): Promise<void> {
    await this.getDreamsForPage({
      skip: 0,
      limit: 13,
    });
    await this.getDreamDates();
    await this.getAllSessions();
  },
  data: () => ({
    bottomNavHeight: 56,
  }),
  methods: {
    ...mapActions(useMainStore, ["getSettings"]),
    ...mapActions(useDreamStore, ["getDreamsForPage", "getDreamDates"]),
    ...mapActions(useSessionStore, ["getAllSessions"]),
  },
  computed: {
    ...mapState(useMainStore, ["gLoading", "gColors"]),
    isMobile(): boolean {
      return this.$vuetify.breakpoint.name === "xs";
    },
  },
});
</script>
<style lang="scss">
$scrollbar-bg-color: #171717;
$scrollbar-thumb-color: #898989;
$app-title-bar-width: 125px;

html {
  background-color: black;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 10px;
  background-color: $scrollbar-bg-color;
}
::-webkit-scrollbar-thumb {
  border-radius: 50px;
  background-color: $scrollbar-thumb-color;
}
.v-app-bar-title__content {
  width: $app-title-bar-width !important;
}
.ios-overlay {
  height: 125px;
  width: 125px;
  border-radius: 15px !important;
}
</style>
