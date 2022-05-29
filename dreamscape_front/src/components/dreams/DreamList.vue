<template>
  <v-card
    v-if="dreams && dreams.length > 0"
    class="ma-2 ma-auto"
    max-width="800"
    :color="getColors.topBarColor"
  >
    <v-list class="overflow-y-auto" :color="getColors.topBarColor">
      <template v-for="(dream, i) of dreams">
        <v-list-item
          :key="dream._id"
          :to="{ name: 'ViewDreamPage', params: { id: dream._id } }"
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
                <v-row>
                  <v-col :style="{ color: getColors.textColor }">
                    {{ formatDreamDate(dream.date) }}
                  </v-col>
                  <v-col class="text-right" style="font-size: 10px">
                    <div
                      :style="getColors.textColor | alpha('90%', true, 'color')"
                    >
                      {{ dream.dreams.length }} dream{{
                        dream.dreams.length !== 1 ? "s" : ""
                      }}
                    </div>
                  </v-col>
                </v-row>
              </v-list-item-title>
              <v-list-item-subtitle
                :style="getColors.textColor | alpha('70%', true, 'color')"
              >
                {{ dream.dreams[0].subDream }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-lazy>
        </v-list-item>
        <v-divider
          v-if="i < dreams.length - 1"
          :key="i"
          class="mx-2"
        ></v-divider>
      </template>
      <v-skeleton-loader
        v-if="moreAvailable"
        v-intersect="loadMoreDreams"
        type="list-item@10"
      />
    </v-list>
  </v-card>
  <v-container v-else>
    <v-card :color="getColors.topBarColor">
      <v-card-title :style="{ color: getColors.textColor }">
        No Dreams Here Yet
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Dream } from "@/interfaces/dream.interface";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "DreamList",
  created() {
    this.dreams = this.$store.getters.getDreams;
  },
  data: () => ({
    pageLoaded: 0,
    moreAvailable: true,
    dreams: [] as Dream[],
  }),
  methods: {
    async loadMoreDreams(entries: IntersectionObserverEntry[]): Promise<void> {
      const total = this.dreams.length;
      if (entries[0].isIntersecting && this.moreAvailable) {
        const skip = this.dreams.length;
        const limit = this.$store.state.limit;
        this.pageLoaded++;
        await this.$store.dispatch("loadMoreDreams", { skip, limit });
        if (total === this.dreams.length) this.moreAvailable = false;
      }
    },
    formatDreamDate(date: string): string {
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
