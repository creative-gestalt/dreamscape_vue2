<template>
  <v-fade-transition hide-on-leave>
    <dream-overview v-if="show" />
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from "vue";
import DreamOverview from "../components/DreamOverview.vue";

export default Vue.extend({
  name: "DreamOverviewPage",
  created(): void {
    setTimeout(() => (this.show = true), 100);
  },
  data: () => ({
    show: false,
  }),
  methods: {},
  components: {
    DreamOverview,
  },
});
</script>
