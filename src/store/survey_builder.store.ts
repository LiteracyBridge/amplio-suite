import { defineStore } from "pinia";
import { groupBy } from "lodash";
import { message, notification } from "ant-design-vue";
import { useAppStore } from "./app.store";
import { ApiRequest } from "@/api";
import { Question } from "@/models/question";
import { Survey, SurveyStatus } from "@/models/survey";

export const useSurveyBuilder = defineStore("survey-builder", {
  state: () => ({
    loading: false,
    // questions: [] as Question[],
    // sections: [] as QuestionSection[],
    surveys: [] as Survey[],
    activeSurvey: null as null | Survey,
    // dependents: [] as QuestionDependent[],
    mode: "edit" as "edit" | "sub-question",
    selectedQuestion: null as null | Question,
  }),
  getters: {
    published: (state) =>
      state.surveys.filter((s) => s.status == SurveyStatus.published) || [],
    drafts: (state) =>
      state.surveys.filter(
        (s) => s.status == SurveyStatus.draft || s.status == null,
      ),
    archived: (state) =>
      state.surveys.filter((s) => s.status == SurveyStatus.archived),
    sections: (state) => {
      return (state.activeSurvey?.sections || []).filter(
        (s) => !(s.is_deleted || false),
      );
    },
    groupBySection: (state) => {
      const data = groupBy(state.activeSurvey?.questions || [], "section_id");
      return Object.keys(data).map((key) => ({
        section: state.activeSurvey.sections.find((s) => s.id === +key),
        questions: data[key],
      }));
    },
    sectionHasQuestions: (state) => {
      return (sectionId: string | number): boolean => {
        return (
          state.activeSurvey.questions.filter(
            (q) => q.section_id == sectionId && !(q.is_deleted || false),
          ).length > 0
        );
      };
    },
    // findById:
    //   (state) =>
    //     (id: string | number): null | Question => {
    //       return state.activeSurvey.questions.find((q) => q.id == id);
    //     },
    getDependentQuestion:
      (state) =>
        (questionId: string): null | Question => {
          return state.activeSurvey.questions.find((q) => q._id === questionId);
        },
    questions: (state) => {
      return (opts?: {
        sectionId?: number;
        sectionUuid?: string;
        // parentId?: string | number;
        // isSubQuestions?: boolean;
      }): Question[] => {
        const { sectionId } = opts ?? {};

        // if (parentId != null && opts.isSubQuestions == true) {
        //   return state.activeSurvey.questions.filter(
        //     (q) => q.parent_id == parentId && !(q.is_deleted || false),
        //   );
        // }

        if (sectionId != null) {
          return state.activeSurvey.questions.filter(
            (q) => (q.section_id === sectionId || q.section_id === opts.sectionUuid) && !(q.is_deleted || false),
          );
        }

        return state.activeSurvey.questions.filter(
          (q) => !(q.is_deleted || false),
        );
      };
    },
  },
  actions: {
    setSurvey(survey: Survey) {
      survey.questions = survey.questions.map((q) => {
        const question: Question = Object.create(Question.prototype);
        Object.assign(question, q);
        question.choices = question.choices
          .map((c) => {
            c.sub_options = question.choices.filter(
              (c2) => c2.parent_id == c.choice_id,
            );
            return c;
          })
          .filter((c) => c.parent_id == null);
        return question;
      });
      this.$state.activeSurvey = survey;
    },
    reorderQuestions(data: Question[]) {
      this.$state.activeSurvey.questions = data;
      return this.$state.activeSurvey.questions;
    },
    addQuestion(form: Question) {
      form.is_new = true;
      this.$state.activeSurvey.questions = [
        ...this.$state.activeSurvey.questions,
        form,
      ];
      this.$state.selectedQuestion = form;
      this.$state.mode = "edit"
      return this.$state.activeSurvey.questions;
    },
    updateQuestion(form: Question) {
      form.is_updated = true;
      this.$state.activeSurvey.questions =
        this.$state.activeSurvey.questions.map((q) =>
          q._id === form._id ? { ...q, ...form } : q,
        );
      return this.$state.activeSurvey.questions;
    },

    /// remove a specific question from the active survey.
    deleteQuestion(item: Question) { 
      const questions = this.$state.activeSurvey.questions; // Get all questions
      const index = questions.findIndex((q) => q._id === item._id);// Get the index
      if (index > -1) {
        questions.splice(index, 1); // Remove from array
        this.$state.activeSurvey.questions = questions;// updates the questions array in the store's state with the modified array that no longer includes the deleted question.
      }
    },
    deleteSection(id: string | number) {
      return (this.$state.activeSurvey.sections =
        this.$state.activeSurvey.sections.map((q) => {
          if (q.id == id) {
            q.is_deleted = true;
          }
          return q;
        }));
    },
    duplicateQuestion(opts: {
      source: Question;
      sectionId: string | number;
    }): Question {
      const target: Question = JSON.parse(JSON.stringify(opts.source));
      target.section_id = opts.sectionId;
      target.is_new = true;
      target._id = crypto.randomUUID();

      target.choices = target.choices.map((c) => {
        c.choice_id = crypto.randomUUID();
        c.is_new = true;

        c.sub_options = c.sub_options.map((c2) => {
          c2.choice_id = crypto.randomUUID();
          c2.is_new = true;
          c2.parent_id = c.choice_id;
          return c2;
        });
        return c;
      });
      return target;
    },
    duplicateSection(sectionId: string | number) {
      const newSection = JSON.parse(
        JSON.stringify(
          this.$state.activeSurvey.sections.find((s) => s.id == sectionId),
        ),
      );

      newSection.id = crypto.randomUUID();
      newSection.is_new = true;

      const questions = JSON.parse(
        JSON.stringify(
          this.$state.activeSurvey.questions.filter(
            (i) => i.section_id == sectionId,
          ) || [],
        ),
      ).map((question: Question) => {
        return this.duplicateQuestion({
          source: question,
          sectionId: newSection.id,
        });
      });

      this.$state.activeSurvey.sections = [
        ...this.$state.activeSurvey.sections,
        newSection,
      ];
      this.$state.activeSurvey.questions = [
        ...this.$state.activeSurvey.questions,
        ...questions,
      ];
    },
    async download() {
      this.$state.loading = true;
      return ApiRequest.get<Survey>(
        `user-feedback/surveys/${useAppStore().programCode}`,
      )
        .then((resp) => {
          this.$state.surveys = resp.map((s) => {
            const survey: Survey = Object.create(Survey.prototype);
            Object.assign(survey, s);
            this.setSurvey(survey);
            return survey;
          });
          return resp;
        })
        .catch((err) => notification.error({ message: err.message }))
        .finally(() => {
          this.$state.loading = false
        });
    },
    async createSurvey(form: Partial<Survey>): Promise<Survey> {
      this.$state.loading = true;
      return ApiRequest.post<Survey>("user-feedback/surveys", form)
        .then(([resp]) => {
          this.$state.surveys = [...this.$state.surveys, resp];
          return resp;
        })
        .finally(() => (this.$state.loading = false));
    },
    saveChanges() {
      const survey = this.$state.activeSurvey;
      this.$state.loading = true;

      return ApiRequest.post<Survey>(
        `user-feedback/surveys/${survey.id}/questions`,
        survey,
      )
        .then(([resp]) => {
          this.setSurvey(resp);
          this.$state.surveys = this.$state.surveys.map((s) =>
            s.id == resp.id ? resp : s,
          );

          notification.success({
            message: `Notification`,
            description: "Survey changes has been saved successfully!",
          });
          return resp;
        })
        .catch((err) => message.error(err))
        .finally(() => (this.$state.loading = false));
    },
    updateStatus(status: SurveyStatus) {
      const survey = this.$state.activeSurvey;
      this.$state.loading = true;

      return ApiRequest.put<Survey>(
        `user-feedback/surveys/${survey.id}/status?status=${status}`,
        {},
      )
        .then(([resp]) => {
          this.setSurvey(resp);
          this.$state.surveys = this.$state.surveys.map((s) =>
            s.id == resp.id ? resp : s,
          );

          message.success("Survey status updated!");
          return resp;
        })
        .finally(() => (this.$state.loading = false));
    },
  },
});
