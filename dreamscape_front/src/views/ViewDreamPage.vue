<template>
  <v-fade-transition hide-on-leave>
    <view-dream v-if="show" />
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from "vue";
import ViewDream from "../components/dreams/ViewDream.vue";

export default Vue.extend({
  name: "ViewDreamPage",
  created(): void {
    setTimeout(() => (this.show = true), 100);
  },
  data: () => ({
    show: false,
  }),
  components: {
    ViewDream,
  },
});
</script>
