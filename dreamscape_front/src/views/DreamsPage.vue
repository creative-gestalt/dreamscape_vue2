<template>
  <v-fade-transition hide-on-leave>
    <div v-if="show">
      <v-tabs
        v-model="compTab"
        :color="gColors.textColor"
        :background-color="gColors.backgroundColor"
        :grow="isMobile"
        centered
      >
        <v-tabs-slider :color="gColors.iconColor"></v-tabs-slider>

        <v-tab v-for="(tab, i) in tabs" :key="tab" @change="handleTabs(i)">
          {{ tab }}
        </v-tab>
      </v-tabs>

      <v-tabs-items
        v-model="compTab"
        :style="{ background: gColors.backgroundColor }"
        touchless
      >
        <v-tab-item transition="slide-y-transition">
          <new-dream v-show="compTab === 0" />
        </v-tab-item>
        <v-tab-item transition="slide-y-transition">
          <dream-list v-if="compTab === 1" />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from "vue";
import NewDream from "../components/dreams/NewDream.vue";
import DreamList from "../components/dreams/DreamList.vue";
import { mainStore } from "@/stores/main";
import { mapState, mapStores } from "pinia";
import { dreamStore } from "@/stores/dreams";

export default Vue.extend({
  name: "DreamsPage",
  created(): void {
    setTimeout(() => (this.show = true), 100);
    this.selectedTab = this.dreamsStore.gCurrentTab;
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
  methods: {
    handleTabs(index: number): void {
      this.selectedTab = index;
      this.dreamsStore.updateCurrentTab(index);
    },
  },
  computed: {
    ...mapStores(dreamStore),
    ...mapState(mainStore, ["gColors"]),
    isMobile(): boolean {
      return this.$vuetify.breakpoint.name === "xs";
    },
    compTab: {
      get(): number {
        return this.dreamsStore.gCurrentTab;
      },
      set(newVal: number): number {
        return newVal;
      },
    },
  },
});
</script>
