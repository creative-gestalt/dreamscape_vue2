<template>
  <v-card
    v-if="sessions && sessions.length > 0"
    class="ma-2 ma-auto"
    max-width="800"
    :color="getColors.topBarColor"
  >
    <v-list class="overflow-y-auto" :color="getColors.topBarColor">
      <template v-for="(session, i) of sessions">
        <v-list-item
          :key="session._id"
          :to="{ name: 'ViewSessionPage', params: { id: session._id } }"
        >
          <v-lazy
            min-width="100%"
            max-width="100%"
            :options="{
              threshold: 0.5,
            }"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ formatSessionDate(session.date) }}
              </v-list-item-title>
              <v-list-item-subtitle
                :style="getColors.textColor | alpha('70%', true, 'color')"
              >
                {{ session.session.entity }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-lazy>
        </v-list-item>
        <v-divider
          v-if="i < sessions.length - 1"
          :key="i"
          class="mx-2"
        ></v-divider>
      </template>
      <v-skeleton-loader
        v-if="moreAvailable"
        v-intersect="loadMoreSessions"
        type="list-item@10"
      />
    </v-list>
  </v-card>
  <v-container v-else>
    <v-card :color="getColors.topBarColor">
      <v-card-title :style="{ color: getColors.textColor }">
        No Sessions Here Yet
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Session } from "@/interfaces/session.interface";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "SessionList",
  created(): void {
    this.sessions = this.$store.getters.getSessions;
  },
  data: () => ({
    pageLoaded: 0,
    moreAvailable: true,
    sessions: [] as Session[],
  }),
  methods: {
    async loadMoreSessions(
      entries: IntersectionObserverEntry[]
    ): Promise<void> {
      const total = this.sessions.length;
      if (entries[0].isIntersecting && this.moreAvailable) {
        const skip = this.sessions.length;
        const limit = this.$store.state.limit;
        this.pageLoaded++;
        await this.$store.dispatch("loadMoreSessions", { skip, limit });
        if (total === this.sessions.length) this.moreAvailable = false;
      }
    },
    formatSessionDate(date: string): string {
      return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  computed: {
    ...mapGetters(["getColors"]),
  },
});
</script>
