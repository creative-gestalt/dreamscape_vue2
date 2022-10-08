<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card
          class="pa-2 ma-auto"
          max-width="800"
          :color="gColors.topBarColor"
          hover
        >
          <v-chip
            v-for="(dream, i) of dreams"
            :key="dream + i"
            class="mb-2 mx-1"
            :style="{ color: gColors.textColor }"
            @click:close="deleteSubDream(i)"
            outlined
            close
            label
          >
            {{ dream.subDream | truncate(7) }} {{ dream.time }}
          </v-chip>
          <v-textarea
            v-model="dream"
            ref="dreamInput"
            label="Dream"
            rows="8"
            :messages="time"
            :color="gColors.textColor"
            outlined
            dense
          ></v-textarea>
          <v-row class="mb-3" no-gutters>
            <v-col cols="12">
              <v-btn
                @click="addDream(dream)"
                :color="gColors.backgroundColor | alpha('50%')"
                :style="{ color: gColors.textColor }"
                block
              >
                Add Dream
              </v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                min-width="auto"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    :color="gColors.backgroundColor | alpha('50%')"
                    :style="{ color: gColors.textColor }"
                    width="98%"
                  >
                    {{ computedDay }}
                  </v-btn>
                </template>
                <v-date-picker
                  v-model="date"
                  :max="max"
                  min="1950-01-01"
                  @change="saveDate"
                  show-adjacent-months
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-btn
                @click="openTimeModal"
                :color="gColors.backgroundColor | alpha('50%')"
                :style="{ color: gColors.textColor }"
                width="98%"
              >
                <v-icon>mdi-clock-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-card
          class="pa-2 mt-5 ma-auto"
          max-width="800"
          :color="gColors.topBarColor"
          hover
        >
          <v-chip
            v-for="(chip, i) in chips"
            :key="chip + i"
            @click:close="removeKeyword(chip)"
            class="mx-1 mb-1"
            outlined
            close
          >
            {{ chip }}
          </v-chip>
          <v-text-field
            class="mb-n6"
            v-model="keywords"
            label="Keywords"
            append-icon="mdi-check"
            :color="gColors.textColor"
            @click:append="addChip(keywords)"
            @keyup.enter="addChip(keywords)"
            outlined
            rounded
            dense
          ></v-text-field>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="ma-auto" max-width="800">
      <v-btn
        class="mt-5"
        @click="completeDream"
        :color="gColors.completeBtnColor"
        block
        light
      >
        Complete
      </v-btn>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :style="{ color: gColors.textColor }"
      :color="gColors.completeBtnColor"
      bottom
    >
      <template v-slot:action="{ attrs }">
        <v-btn color="black" v-bind="attrs" @click="snackbar = false" text>
          Close
        </v-btn>
      </template>
      {{ snackText }}
    </v-snackbar>

    <v-dialog v-model="timeModal" max-width="300">
      <v-card :color="gColors.topBarColor">
        <v-card-title>Set Time</v-card-title>
        <v-container>
          <v-text-field ref="time" :value="time" filled outlined>
            {{ time }}
          </v-text-field>
          <v-btn
            @click="setNewTime"
            :color="gColors.completeBtnColor"
            light
            block
          >
            Set
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { SubDream } from "@/interfaces/dream.interface";
import { mapState, mapStores } from "pinia";
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";

export default Vue.extend({
  name: "NewDream",
  created() {
    // let result = [];
    // for (const i in navigator) {
    //   result.push(i + "\n");
    // }
    // this.dream = navigator.userAgent.toString();
    this.date = this.max = this.gDate().slice(0, 10);
  },
  data: () => ({
    date: "",
    menu: false,
    max: "",
    dream: "",
    dreams: [] as SubDream[],
    keywords: "",
    chips: [] as string[],
    snackbar: false,
    timeout: 3000,
    snackText: "",
    time: new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
    timeModal: false,
  }),
  methods: {
    openTimeModal(): void {
      this.timeModal = true;
    },
    setNewTime(): void {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.time = String(this.$refs.time.$refs.input.value);
      this.timeModal = false;
    },
    deleteSubDream(index: number): void {
      this.dreams.splice(index, 1);
    },
    removeKeyword(item: string): void {
      this.chips = [...this.chips].filter((k) => k !== item);
    },
    saveDate(date: Date) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.$refs.menu.save(date);
    },
    addDream(dreamText: string, refocus = true): void {
      if (dreamText) {
        this.dreams.push({ subDream: dreamText, time: this.time });
        this.dream = "";
        if (refocus) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.$refs.dreamInput.$refs.input.focus();
        }
      } else {
        this.snackText = "Dream cannot be empty";
        this.snackbar = true;
      }
      this.time = new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },
    addChip(value: string): void {
      if (value && !this.chips.includes(value)) {
        this.chips.push(value);
        this.keywords = "";
      } else {
        this.snackText = this.chips.includes(value)
          ? "Cannot save duplicate keywords"
          : "Keyword cannot be empty";
        this.snackbar = true;
      }
    },
    async completeDream(): Promise<void> {
      await this.mainStore.updateLoading(true);
      if (this.dream.length > 0) this.addDream(this.dream, false);
      if (this.date && this.dreams.length > 0) {
        await this.dreamsStore.addDream({
          date: this.date + this.gDate().slice(10, 19),
          dreams: this.dreams,
          keywords:
            this.chips.length > 0
              ? this.chips
              : this.keywords
              ? [this.keywords]
              : [],
        });
        await this.dreamsStore.getDreamsForPage({
          skip: 0,
          limit: 13,
        });
        this.dream = "";
        this.dreams = [] as SubDream[];
        this.keywords = "";
        this.chips = [] as string[];
        this.snackText = "Successfully added dream";
      } else {
        this.snackText = "No dreams to submit";
      }
      await this.mainStore.updateLoading(false);
      this.snackbar = true;
    },
  },
  computed: {
    ...mapStores(useMainStore, useDreamStore),
    ...mapState(useMainStore, ["gColors", "gDate"]),
    computedDay(): string {
      return this.date
        ? new Date(this.date + this.gDate().slice(10, 19)).toLocaleString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            }
          )
        : "";
    },
    computedDate(): string {
      return this.date
        ? new Date(this.date + this.gDate().slice(10, 19)).toLocaleString(
            "en-US",
            {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )
        : "";
    },
    isMobile(): boolean {
      return this.$vuetify.breakpoint.name === "xs";
    },
  },
});
</script>
