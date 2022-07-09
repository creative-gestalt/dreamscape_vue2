<template>
  <v-app id="app" :style="{ background: getColors.backgroundColor }">
    <v-app-bar :color="getColors.topBarColor" dense dark app>
      <div class="d-flex align-center pr-5">
        <v-img class="ml-3" width="35" src="@/assets/ga-logo-black.png"></v-img>
      </div>
      <v-app-bar-title
        class="text-no-wrap"
        :style="{ color: getColors.iconColor }"
      >
        {{ $route.meta.title }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div v-if="!isMobile">
        <v-btn to="/dreams" text>
          <v-icon :color="getColors.iconColor"> mdi-sleep </v-icon>
        </v-btn>
        <v-btn to="/sessions" text>
          <v-icon :color="getColors.iconColor"> mdi-notebook </v-icon>
        </v-btn>
        <v-btn to="/dream-overview" text>
          <v-icon :color="getColors.iconColor">mdi-calendar</v-icon>
        </v-btn>
        <v-btn to="/settings" text>
          <v-icon :color="getColors.iconColor"> mdi-cog-outline </v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-bottom-navigation
      v-if="isMobile"
      :background-color="getColors.topBarColor"
      color="transparent"
      grow
      shift
      light
      app
    >
      <v-btn :class="paddingClass" to="/dreams">
        <span :class="marginClass" :style="{ color: getColors.iconColor }">
          Dreams
        </span>
        <v-icon :color="getColors.iconColor">mdi-sleep</v-icon>
      </v-btn>
      <v-btn :class="paddingClass" to="/sessions">
        <span :class="marginClass" :style="{ color: getColors.iconColor }">
          Sessions
        </span>
        <v-icon :color="getColors.iconColor"> mdi-notebook </v-icon>
      </v-btn>
      <v-btn :class="paddingClass" to="/dream-overview">
        <span :class="marginClass" :style="{ color: getColors.iconColor }">
          Overview
        </span>
        <v-icon :color="getColors.iconColor"> mdi-calendar </v-icon>
      </v-btn>
      <v-btn :class="paddingClass" to="/settings">
        <span :class="marginClass" :style="{ color: getColors.iconColor }">
          Settings
        </span>
        <v-icon :color="getColors.iconColor"> mdi-cog-outline </v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "App",
  async mounted(): Promise<void> {
    await this.$store.dispatch("getSettings");
  },
  async created(): Promise<void> {
    await this.$store.dispatch("getAllDreams");
    await this.$store.dispatch("getDreamDates");
    await this.$store.dispatch("getAllSessions");
    // if (navigator.userAgent.toLowerCase().indexOf("iphone") > -1) {
    //   this.bottomNavHeight = 85;
    //   this.paddingClass = "pb-8";
    //   this.marginClass = "mt-n3";
    // }
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
    ...mapGetters(["getColors"]),
    isMobile(): boolean {
      return this.$vuetify.breakpoint.name === "xs";
    },
  },
});
</script>
<style lang="scss">
$scrollbar-bg-color: #171717;
$scrollbar-thumb-color: #898989;

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
</style>
