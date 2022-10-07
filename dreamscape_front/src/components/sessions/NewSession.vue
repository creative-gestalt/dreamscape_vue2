<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card
          class="pa-2 ma-auto"
          max-width="800"
          :color="gColors.topBarColor"
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
                :color="gColors.backgroundColor | alpha('50%')"
                outlined
              >
                <v-row align="center" justify="center">
                  <v-col cols="10">
                    <v-card-title :style="{ color: gColors.textColor }">
                      {{ computedDate }}
                    </v-card-title>
                  </v-col>
                  <v-col cols="2">
                    <v-icon
                      class="float-right mr-3"
                      :color="gColors.textColor | alpha('50%')"
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
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card
          class="pa-2 pt-3 ma-auto"
          max-width="800"
          :color="gColors.topBarColor"
          hover
        >
          <v-row class="align-center">
            <v-col cols="1">
              <p class="mb-3 mr-1 grey--text text-no-wrap">Q&A:</p>
            </v-col>
            <v-col cols="11">
              <v-chip
                v-for="(qa, i) of qas"
                :key="qa + i"
                class="mb-2 mx-1"
                :style="{ color: gColors.textColor }"
                @click:close="deleteQuestionsAnswers(i)"
                outlined
                close
                label
              >
                QA {{ i + 1 }}
              </v-chip>
            </v-col>
          </v-row>
          <v-text-field
            v-model="entity"
            label="Entity"
            :color="gColors.textColor"
            @keyup.enter="$refs.questionInput.focus()"
            outlined
            shaped
            dense
          ></v-text-field>
          <v-text-field
            v-model="question"
            label="Question"
            :color="gColors.textColor"
            ref="questionInput"
            @keyup.enter="$refs.answerInput.focus()"
            outlined
            shaped
            dense
          ></v-text-field>
          <v-text-field
            v-model="answer"
            label="Answer"
            :color="gColors.textColor"
            ref="answerInput"
            :messages="time"
            @keyup.enter="addQuestionsAnswers({ question, answer })"
            outlined
            shaped
            dense
          ></v-text-field>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card
          class="pa-2 ma-auto"
          max-width="800"
          :color="gColors.topBarColor"
          hover
        >
          <v-row no-gutters>
            <v-col cols="10" class="text-left">
              <v-btn
                @click="addQuestionsAnswers({ question, answer })"
                :color="gColors.backgroundColor | alpha('50%')"
                :style="{ color: gColors.textColor }"
                width="98%"
                light
              >
                Add Q&A
              </v-btn>
            </v-col>
            <v-col cols="2">
              <v-btn
                @click="openTimeModal"
                :color="gColors.backgroundColor | alpha('50%')"
                :style="{ color: gColors.textColor }"
                block
              >
                <v-icon>mdi-clock-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="ma-auto" max-width="800">
      <v-btn
        class="mt-5"
        @click="completeSession"
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
            :style="{ color: gColors.textColor }"
            :color="gColors.completeBtnColor"
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
import { QA } from "@/interfaces/session.interface";
import { mapState, mapStores } from "pinia";
import { mainStore } from "@/stores/main";
import { sessionStore } from "@/stores/sessions";

export default Vue.extend({
  name: "NewSession",
  created() {
    this.date = this.max = this.gDate().slice(0, 10);
  },
  data: () => ({
    date: "",
    menu: false,
    max: "",
    entity: "",
    question: "",
    answer: "",
    qas: [] as QA[],
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
    deleteQuestionsAnswers(index: number): void {
      this.qas.splice(index, 1);
    },
    saveDate(date: Date) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.$refs.menu.save(date);
    },
    addQuestionsAnswers(qa: QA): void {
      if (qa.question.length && qa.answer.length) {
        this.qas.push(qa);
        this.question = "";
        this.answer = "";
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.$refs.questionInput.$refs.input.focus();
      } else {
        this.snackText = "Session cannot be empty";
        this.snackbar = true;
      }
    },
    async completeSession(): Promise<void> {
      await this.mainStore.updateLoading(true);
      if (
        this.entity.length > 0 &&
        this.question.length > 0 &&
        this.answer.length > 0
      )
        this.addQuestionsAnswers({
          question: this.question,
          answer: this.answer,
        });
      if (this.date && this.entity.length > 0 && this.qas.length > 0) {
        await this.sessionsStore.addSession({
          date: this.date + this.gDate().slice(10, 19),
          session: { entity: this.entity, qas: this.qas, time: this.time },
        });
        await this.sessionsStore.getAllSessions;
        this.entity = "";
        this.qas = [];
        this.snackText = "Successfully added session";
      } else {
        this.snackText = "No sessions to submit";
      }
      await this.mainStore.updateLoading(false);
      this.snackbar = true;
    },
  },
  computed: {
    ...mapStores(mainStore, sessionStore),
    ...mapState(mainStore, ["gColors", "gDate"]),
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
