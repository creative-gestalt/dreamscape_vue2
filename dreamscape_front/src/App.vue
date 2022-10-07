<template>
  <v-app id="app" :style="{ background: gColors.backgroundColor }">
    <v-app-bar :color="gColors.topBarColor" :height="isIOS ? 90 : 56" dark app>
      <div class="d-flex align-center pr-5">
        <v-img
          class="ml-3"
          :style="isIOS ? 'transform: translateY(20px)' : ''"
          width="35"
          src="@/assets/ga-logo-black.png"
        ></v-img>
      </div>
      <v-app-bar-title
        class="text-no-wrap"
        :style="{
          color: gColors.iconColor,
          transform: isIOS ? 'translateY(20px)' : '',
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
      color="transparent"
      :min-height="fullscreenBuffer"
      grow
      shift
      light
      app
    >
      <v-btn :class="paddingClass" to="/dreams">
        <span :class="marginClass" :style="{ color: gColors.iconColor }">
          Dreams
        </span>
        <v-icon :color="gColors.iconColor">mdi-sleep</v-icon>
      </v-btn>
      <v-btn :class="paddingClass" to="/sessions">
        <span :class="marginClass" :style="{ color: gColors.iconColor }">
          Sessions
        </span>
        <v-icon :color="gColors.iconColor"> mdi-notebook </v-icon>
      </v-btn>
      <v-btn :class="paddingClass" to="/dream-overview">
        <span :class="marginClass" :style="{ color: gColors.iconColor }">
          Overview
        </span>
        <v-icon :color="gColors.iconColor"> mdi-calendar </v-icon>
      </v-btn>
      <v-btn :class="paddingClass" to="/settings">
        <span :class="marginClass" :style="{ color: gColors.iconColor }">
          Settings
        </span>
        <v-icon :color="gColors.iconColor"> mdi-cog-outline </v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { dreamStore } from "@/stores/dreams";
import { sessionStore } from "@/stores/sessions";
import { mapState, mapStores } from "pinia";
import { mainStore } from "@/stores/main";

export default Vue.extend({
  name: "App",
  async mounted(): Promise<void> {
    await this.mainStore.getSettings();
  },
  async created(): Promise<void> {
    await this.dreamsStore.getDreamsForPage({
      skip: 0,
      limit: 13,
    });
    await this.dreamsStore.getDreamDates();
    await this.sessionsStore.getAllSessions();
  },
  data: () => ({
    bottomNavHeight: 56,
    paddingClass: "",
    marginClass: "",
  }),
  methods: {
    //
  },
  computed: {
    ...mapStores(mainStore, dreamStore, sessionStore),
    ...mapState(mainStore, ["gColors", "gLoading"]),
    isMobile(): boolean {
      return this.$vuetify.breakpoint.name === "xs";
    },
    isIOS(): boolean {
      // return true;
      return this.fullscreenBuffer === 80;
    },
    fullscreenBuffer(): number {
      return navigator.platform.match(/iPhone|iPod|iPad/) ? 80 : 56;
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
