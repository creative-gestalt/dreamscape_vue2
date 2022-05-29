<template>
  <v-fade-transition hide-on-leave>
    <view-session v-if="show" />
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from "vue";
import ViewSession from "../components/sessions/ViewSession.vue";

export default Vue.extend({
  name: "ViewSessionPage",
  created(): void {
    setTimeout(() => (this.show = true), 100);
  },
  data: () => ({
    show: false,
  }),
  components: {
    ViewSession,
  },
});
</script>
