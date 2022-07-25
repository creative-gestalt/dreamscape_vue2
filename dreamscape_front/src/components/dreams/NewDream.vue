<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card
          class="pa-2 ma-auto"
          max-width="800"
          :color="getColors.topBarColor"
          hover
        >
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="auto"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-card
                v-bind="attrs"
                v-on="on"
                class="mb-5"
                :color="getColors.backgroundColor | alpha('50%')"
                outlined
              >
                <v-row align="center" justify="center">
                  <v-col cols="10">
                    <v-card-title :style="{ color: getColors.textColor }">
                      {{ computedDate }}
                    </v-card-title>
                  </v-col>
                  <v-col cols="2">
                    <v-icon
                      class="float-right mr-3"
                      :color="getColors.textColor | alpha('50%')"
                    >
                      mdi-gesture-tap
                    </v-icon>
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <v-date-picker
              v-model="date"
              :max="max"
              min="1950-01-01"
              @change="saveDate"
              show-adjacent-months
            ></v-date-picker>
          </v-menu>
          <v-chip
            v-for="(dream, i) of dreams"
            :key="dream + i"
            class="mb-2 mt-n3 mx-1"
            :style="{ color: getColors.textColor }"
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
            rows="4"
            :messages="time"
            :color="getColors.textColor"
            outlined
            shaped
            dense
          ></v-textarea>
          <v-row no-gutters>
            <v-col cols="10" class="text-left">
              <v-btn
                @click="addDream(dream)"
                :color="getColors.backgroundColor | alpha('50%')"
                :style="{ color: getColors.textColor }"
                width="98%"
              >
                Add Dream
              </v-btn>
            </v-col>
            <v-col cols="2">
              <v-btn
                @click="openTimeModal"
                :color="getColors.backgroundColor | alpha('50%')"
                :style="{ color: getColors.textColor }"
                block
              >
                <v-icon>mdi-clock-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-card
          class="pa-2 mt-5 ma-auto"
          max-width="800"
          :color="getColors.topBarColor"
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
            :color="getColors.textColor"
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
        :color="getColors.completeBtnColor"
        block
        light
      >
        Complete
      </v-btn>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :style="{ color: getColors.textColor }"
      :color="getColors.completeBtnColor"
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
      <v-card :color="getColors.topBarColor">
        <v-card-title>Set Time</v-card-title>
        <v-container>
          <v-text-field ref="time" :value="time" filled outlined>
            {{ time }}
          </v-text-field>
          <v-btn
            @click="setNewTime"
            :style="{ color: getColors.textColor }"
            :color="getColors.completeBtnColor"
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
import { mapGetters } from "vuex";
import { SubDream } from "@/interfaces/dream.interface";

export default Vue.extend({
  name: "NewDream",
  created() {
    this.date = this.max = this.getDate().slice(0, 10);
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
    addDream(dreamText: string, refocus: true): void {
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
      if (this.dream.length > 0) this.addDream(this.dream, false);
      if (this.date && this.dreams.length > 0) {
        await this.$store.dispatch("addDream", {
          date: this.date + this.getDate().slice(10, 19),
          dreams: this.dreams,
          keywords:
            this.chips.length > 0
              ? this.chips
              : this.keywords
              ? [this.keywords]
              : [],
        });
        await this.$store.dispatch("getAllDreams");
        this.dream = "";
        this.dreams = [] as SubDream[];
        this.keywords = "";
        this.chips = [] as string[];
        this.snackText = "Successfully added dream";
      } else {
        this.snackText = "No dreams to submit";
      }
      this.snackbar = true;
    },
  },
  computed: {
    ...mapGetters(["getColors", "getDate"]),
    computedDate(): string {
      return this.date
        ? new Date(this.date + this.getDate().slice(10, 19)).toLocaleString(
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
