<template>
  <v-card class="ma-2 ma-auto" max-width="800" :color="getColors.topBarColor">
    <v-card-title class="ma-0 pa-1 pb-0">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        clearable
        outlined
        dense
      ></v-text-field>
      <v-select
        v-model="itemsPerPage"
        :items="perPage"
        class="ml-1"
        style="max-width: 75px"
        hide-details
        outlined
        dense
      >
      </v-select>
    </v-card-title>
    <v-data-table
      :items="getDreams"
      :headers="headers"
      :items-per-page="itemsPerPage"
      :style="{ backgroundColor: getColors.topBarColor }"
      item-key="_id"
      mobile-breakpoint="0"
      hide-default-header
      hide-default-footer
      @click:row="handleClick"
      dense
    >
      <template v-slot:item.date="{ item }">
        <div :style="getColors.textColor | alpha('70%', true, 'color')">
          <v-list-item link dense>
            <v-list-item-avatar class="ml-n6 mr-1">
              <span :style="getColors.textColor | alpha('90%', true, 'color')">
                {{ item.dreams.length }}
              </span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span
                  :style="getColors.textColor | alpha('90%', true, 'color')"
                >
                  {{ formatDreamDate(item.date) }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>
                <span class="grey--text">
                  {{ item.dreams[0].subDream }}
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
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
    }
  },
  data: () => ({
    search: "",
    currentPage: 1,
    pagesFromServer: 0,
    itemsPerPage: 8,
    perPage: [8, 10, 15, 20],
    pageLoaded: 0,
    moreAvailable: true,
    dreams: [] as Dream[],
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: true,
        value: "date",
        width: "90%",
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
  },
  computed: {
    ...mapGetters(["getColors", "getDreams", "getDreamsCount"]),
    compPages(): number {
      return Math.ceil(this.$store.getters.getDreamsCount / this.itemsPerPage);
    },
  },
  watch: {
    search(value: string): void {
      if (value) {
        this.$store.dispatch("searchDreams", value);
      } else {
        this.getDreamsForPage(1);
      }
    },
  },
});
</script>
<style lang="scss">
.text-start {
  max-width: 5px;
}
.v-pagination__item {
  opacity: 0.6;
}
</style>
