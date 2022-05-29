<template>
  <v-fade-transition hide-on-leave>
    <div v-if="show">
      <v-tabs
        v-model="tab"
        :color="getColors.textColor"
        :background-color="getColors.backgroundColor"
        :grow="isMobile"
        centered
      >
        <v-tabs-slider :color="getColors.iconColor"></v-tabs-slider>

        <v-tab v-for="(tab, i) in tabs" :key="tab" @change="selectedTab = i">
          {{ tab }}
        </v-tab>
      </v-tabs>

      <v-tabs-items
        v-model="tab"
        :style="{ background: getColors.backgroundColor }"
        touchless
      >
        <v-tab-item transition="slide-y-transition">
          <new-dream v-show="tab === 0" />
        </v-tab-item>
        <v-tab-item transition="slide-y-transition">
          <dream-list v-if="tab === 1" />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from "vue";
import NewDream from "../components/dreams/NewDream.vue";
import DreamList from "../components/dreams/DreamList.vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "DreamsPage",
  created(): void {
    setTimeout(() => (this.show = true), 100);
  },
  data: () => ({
    show: false,
    tab: 0,
    selectedTab: 0,
    tabs: ["New", "List"],
  }),
  components: {
    NewDream,
    DreamList,
  },
  computed: {
    ...mapGetters(["getColors"]),
    isMobile(): boolean {
      return this.$vuetify.breakpoint.name === "xs";
    },
  },
});
</script>
