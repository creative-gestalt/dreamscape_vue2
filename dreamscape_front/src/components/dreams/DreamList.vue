<template>
  <v-card
    v-if="getDreams && getDreams.length > 0"
    class="ma-2 ma-auto"
    max-width="800"
    :color="getColors.topBarColor"
  >
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        clearable
        dense
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :items="getDreams"
      :headers="headers"
      :search="search"
      :items-per-page="itemsPerPage"
      :style="{ backgroundColor: getColors.topBarColor }"
      item-key="_id"
      mobile-breakpoint="0"
      hide-default-footer
      @click:row="handleClick"
      calculate-widths
      dense
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">{{ item.dreams[0].subDream }}</td>
      </template>
      <template v-slot:item.date="{ item }">
        <small
          class="text-no-wrap"
          :style="getColors.textColor | alpha('70%', true, 'color')"
        >
          {{ formatDreamDate(item.date) }}
        </small>
      </template>
      <template v-slot:item.dreams="{ item }">
        <div :style="getColors.textColor | alpha('70%', true, 'color')">
          <div>
            {{ truncate(item.dreams[0].subDream, 50) }}
          </div>
        </div>
      </template>
      <template v-slot:item.count="{ item }">
        <div :style="getColors.textColor | alpha('90%', true, 'color')">
          {{ item.dreams.length }}
        </div>
      </template>
    </v-data-table>
    <v-pagination
      v-model="currentPage"
      :length="compPages"
      @input="getDreamsForPage"
      :color="getColors.completeBtnColor"
    >
    </v-pagination>
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
import { truncate } from "@/utils/constants";

export default Vue.extend({
  name: "DreamList",
  async created() {
    if (this.getDreamsCount === 0) {
      await this.getDreamsForPage(1);
      await this.updatePageCount(true);
    } else {
      await this.updatePageCount();
    }
  },
  data: () => ({
    search: "",
    currentPage: 1,
    pagesFromServer: 0,
    itemsPerPage: 13,
    pageLoaded: 0,
    moreAvailable: true,
    dreams: [] as Dream[],
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: true,
        value: "date",
      },
      {
        text: "Dream",
        align: "start",
        sortable: true,
        value: "dreams",
      },
      {
        text: "Per Night",
        align: "end",
        sortable: true,
        value: "count",
      },
    ],
  }),
  methods: {
    async getDreamsForPage(pageNumber: number): Promise<void> {
      await this.$store.dispatch("updateLoading", true);
      this.currentPage = pageNumber;
      const skip = (pageNumber - 1) * this.itemsPerPage;
      await this.$store.dispatch("getDreamsForPage", {
        skip,
        limit: this.itemsPerPage,
      });
      await this.$store.dispatch("updateLoading", false);
    },
    async updatePageCount(get = false): Promise<void> {
      await this.$store.dispatch("updateLoading", true);
      if (get) await this.$store.dispatch("getDreamsCount");
      this.pagesFromServer = Math.ceil(
        (await this.$store.getters.getDreamsCount) / this.itemsPerPage
      );
      await this.$store.dispatch("updateLoading", false);
    },
    handleClick(dream: Dream): void {
      this.$router.push(`/dream/${dream._id}`);
    },
    formatDreamDate(date: string): string {
      return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    truncate(value: string, count: number): string {
      return truncate(value, count);
    },
  },
  computed: {
    ...mapGetters(["getColors", "getDreams", "getDreamsCount"]),
    compPages(): number {
      return this.pagesFromServer;
    },
  },
});
</script>
