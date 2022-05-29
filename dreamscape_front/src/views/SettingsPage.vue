<template>
  <v-fade-transition hide-on-leave>
    <settings v-if="show" />
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from "vue";
import Settings from "../components/settings/Settings.vue";

export default Vue.extend({
  name: "SettingsPage",
  created(): void {
    setTimeout(() => (this.show = true), 100);
  },
  data: () => ({
    show: false,
  }),
  components: {
    Settings,
  },
});
</script>
