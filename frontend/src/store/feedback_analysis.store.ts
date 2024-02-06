import { defineStore } from "pinia";
import { orderBy } from "lodash";
import { ApiRequest } from "@/api";
import { Analysis } from "@/models/analysis";
import {
  ConditionAction,
  QuestionType,
  DependentCondition,
  Question,
} from "@/models/question";
import { Survey } from "@/models/survey";
import { useAppStore } from "./app.store";
import { useAccountStore } from "./account";
import { notification } from "ant-design-vue";

class Statistics {
  user_feedback: 0;
  total_analysed: 0;
  total_messages: 0;
  total_useless: 0;
}

export const useFeedbackAnalysis = defineStore("feedback-analysis", {
  state: () => ({
    loading: false,
    survey: null as null | Survey,
    questions: [] as Analysis[],
    skipped_messages: [] as string[],
    statistics: new Statistics(),
    // dependents: [] as QuestionDependent[],
  }),
  getters: {
    sections: (state) => {
      return (
        (state.survey?.sections || []).filter(
          (s) => !(s.is_deleted || false)
        ) || []
      );
    },
    // groupBySection: (state) => {
    //   const data = groupBy(state.questions || [], (q) => q.question.section_id);
    //   return Object.keys(data).map((key) => ({
    //     section: state.survey.sections.find((s) => s.id == key),
    //     questions: data[key],
    //   }));
    // },
    findById:
      (state) =>
        (id: string | number): null | Analysis => {
          return state.questions.find((q) => q.id == id);
        },
    subQuestions: (state) => {
      return (parentId: string | number): Analysis[] => {
        return state.questions.filter((q) => q.question.parent_id == parentId);
      };
    },
    //FIXME: remove this function
    sectionQuestions: (state) => {
      return (opts?: {
        sectionId?: string | number;
        parentId?: string | number;
        isSubQuestions?: boolean;
      }): Analysis[] => {
        const { sectionId, parentId } = opts ?? {};

        if (parentId != null && opts.isSubQuestions == true) {
          return state.questions.filter(
            (q) => q.question.parent_id == parentId && !(q.is_deleted || false)
          );
        }

        if (sectionId != null) {
          return state.questions.filter(
            (q) =>
              q.question.section_id == sectionId && !(q.is_deleted || false)
          );
        }

        return state.questions.filter(
          (q) => q.question.parent_id == null && !(q.is_deleted || false)
        );
      };
    },
    getQuestionIndexById: (state) => {
      return (id: string | number): number => {
        return state.questions.findIndex((q) => q.question_id == id);
      };
    },
  },
  actions: {
    setSurvey(survey: Survey) {
      this.$state.survey = survey;
      this.$state.questions = orderBy(
        survey.questions,
        (q: Question) => q.order
      ).map((question: Question) => {
        question.choices = question.choices;
        // .map((c) => {
        //   c.sub_options = question.choices.filter(
        //     (c2) => c2.parent_id == c.choice_id
        //   );
        //   return c;
        // })
        // .filter((c) => c.parent_id == null);

        let show = true;
        if (question.conditions?.action == ConditionAction.show) {
          show = false;
        }

        return {
          id: null,
          choices: [],
          question_id: question.id,
          choice_id: null,
          response: null,
          is_useless: false,
          question: question,
          show: show,
          meta: { show: show, required: question.required },
          single_choice:
            question.type == QuestionType.single_choice
              ? {
                value: null,
                sub_choice: null,
              }
              : null,
        };
      });

      // Fetch statis
      ApiRequest.get<Statistics>(
        `user-feedback/analysis/${survey.id}/statistics?email=${useAccountStore().email
        }&language=${useAppStore().userFeedback.language}&deployment=${useAppStore().userFeedback.deployment
        }`
      ).then(([stats]) => {
        this.$state.statistics = stats;
      });
    },
    updateQuestionConditions(sourceId: string | number) {
      const source = this.$state.questions.find(
        (q) => q.question_id == sourceId
      );
      if (source == null) {
        return;
      }

      // Get all questions whose condition depends on this question
      const dependents = this.$state.questions.filter(
        (q) => q.question?.conditions?.question_id == sourceId
      );

      let response: string[] | number[] = [];

      // TODO: Has a problem with checkboxes. How to handle multiple responses?
      // TODO; add a function to get question select value based on question type
      if (source.question.type == QuestionType.single_choice) {
        response = [
          source.question.choices
            .find(
              (i) =>
                i.choice_id.toString() ==
                source.single_choice?.value?.toString()
            )
            ?.value?.toString(),
        ];
      } else if (source.question.type == QuestionType.multi_choice) {
        response = (source.question.choices || []).flatMap((c) => c.value);
      } else {
        response = [source.response?.toString()];
      }

      for (const dependent of dependents) {
        const condition = dependent?.question?.conditions;

        let matched = false;

        console.log(response, condition);
        // TODO: change condition value to array
        switch (condition.condition) {
          case DependentCondition.equals:
            matched = response.findIndex((i) => i == condition.value) > -1;
            break;
          case DependentCondition.not_equals:
            matched = response[0] != condition.value;
            break;
          case DependentCondition.greater_than:
            matched = response[0] > condition.value;
            break;
          case DependentCondition.less_than:
            matched = response[0] < condition.value;
            break;
          case DependentCondition.greater_than_or_equal_to:
            matched = response[0] >= condition.value;
            break;
          case DependentCondition.less_than_or_equal_to:
            matched = response[0] <= condition.value;
            break;
          case DependentCondition.contains:
            matched =
              response.findIndex((i) => i == condition.value.toLowerCase()) >
              -1;
            break;
          case DependentCondition.not_contains:
            matched =
              response.findIndex((i) => i == condition.value.toLowerCase()) ==
              -1;
            break;
          case DependentCondition.is_empty:
            matched = response == null || response.length == 0;
            break;
          case DependentCondition.is_not_empty:
            matched = response != null && response.length > 0;
            break;
          default:
            matched = response.findIndex((i) => i == condition.value) > -1;
            break;
        }

        // If condition is not met, reset any changes made to the question
        if (!matched) {
          this.$state.questions = this.$state.questions.map((q) => {
            if (q.question_id == dependent.question_id) {
              q.show = q.meta["show"];
              q.question.required = q.meta["required"];
            }
            return q;
          });
          continue;
        }

        this.$state.questions = this.$state.questions.map((q) => {
          if (q.question_id == dependent.question_id) {
            switch (condition.action) {
              case ConditionAction.show:
                q.show = true;
                break;
              case ConditionAction.hide:
                q.show = false;
                break;
              case ConditionAction.required:
                q.question.required = true;
                q.show = true;
                break;
              case ConditionAction.not_required:
                q.question.required = false;
                q.show = true;
                break;
            }
          }
          return q;
        });
        // break;
        // return matched;
        // };
      }
    },
    async download() {
      // TODO: implement downloading of analysis
      // this.$state.loading = true;
      // return ApiRequest.get<Survey>(
      //   `surveys/${useGlobalStore().context.selectedProgramCode}`
      // )
      //   .then((resp) => {
      //     this.$state.surveys = resp.map((s) => {
      //       const survey: Survey = Object.create(Survey.prototype);
      //       Object.assign(survey, s);
      //       return survey;
      //     });
      //     return resp;
      //   })
      //   .catch((err) => message.error(err))
      //   .finally(() => (this.$state.loading = false));
    },
    resetResponses() {
      this.$state.questions = this.$state.questions.map((q) => {
        q.response = null;
        q.single_choice = { value: null, sub_choice: null };
        q.choices = [];
        q.show = true;
        q.error = null;
        return q;
      });
    },
    ///
    /// API Requests
    ///
    saveChanges(extra: {
      message_uuid: string;
      is_useless?: boolean;
      start_time?: Date;
      transcription?: string;
    }) {
      // TODO: implement saving of analysis
      // const survey = this.$state.survey;
      this.$state.loading = true;
      return ApiRequest.post<Analysis>(
        `user-feedback/analysis/${this.$state.survey.id}`,
        {
          questions: this.$state.questions,
          submit_time: new Date(),
          ...extra,
          is_useless: extra.is_useless || false,
          analyst_email: useAccountStore().email,
          transaction: extra.transcription,
        }
      )
        .then(([resp]) => {
          // Reset all responses
          this.resetResponses();

          console.log(resp);
          // this.setSurvey(resp);
          // this.$state.surveys = this.$state.surveys.map((s) =>
          //   s.id == resp.id ? resp : s
          // );
          return resp;
        })
        .finally(() => (this.$state.loading = false));
    },
    async fetchAnalysisReport() {
      this.loading = true;
      return ApiRequest.get<Array<string>>(
        `user-feedback/reports/${this.$state.survey.id}?language=${useAppStore().userFeedback.language}&deployment=${useAppStore().userFeedback.deployment}`,
      )
        .finally(() => (this.$state.loading = false))
        .catch((err) => {
          notification.error({
            message: "Error",
            description: err.message,
          });

          throw err;
        });
    }
  },
});
