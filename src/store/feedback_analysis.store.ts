import { defineStore } from "pinia";
import { orderBy } from "lodash";
import { ApiRequest } from "@/api";
import { Analysis } from "@/models/analysis";
import {
	ConditionAction,
	QuestionType,
	DependentCondition,
	type Question,
	type QuestionChoice,
} from "@/models/question";
import { Survey } from "@/models/survey";
import { useAppStore } from "./app.store";
import { useAccountStore } from "./account";
import { notification } from "ant-design-vue";
import { UserFeedbackMessage } from "@/models/uf_message";

class Statistics {
	by_current_user: 0;
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

		/**
		 * Tracks the selected choice for each question
		 */
		selectedChoice: {} as Record<
			string,
			{ selected: boolean; sub: QuestionChoice[] }
		>,
	}),
	getters: {
		sections: (state) => {
			return (
				(state.survey?.sections || []).filter(
					(s) => !(s.is_deleted || false),
				) || []
			);
		},
		findById:
			(state) =>
			(id: string | number): null | Analysis => {
				return state.questions.find((q) => q.id == id);
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
				(q: Question) => q.order,
			).map((question: Question) => {
				// question.choices = question.choices;

				let show = true;
				if (question.conditions?.action === ConditionAction.show) {
					show = false;
				}

				return {
					id: null as string | null,
					choices: [] as any[],
					question_id: question._id,
					choice_id: null as string | null,
					response: null as any,
					is_useless: false,
					question: question,
					show: show,
					meta: { show: show, required: question.required },
					single_choice:
						question.type === QuestionType.single_choice
							? {
									value: null as any,
									sub_choice: null as any,
								}
							: null,
				};
			});

			// Fetch stats
			ApiRequest.get<Statistics>(
				`user-feedback/analysis/${survey.id}/stats?email=${
					useAccountStore().email
				}&language=${useAppStore().userFeedback.language}&deployment=${
					useAppStore().userFeedback.deployment
				}&program_id=${useAppStore().programCode}`,
			).then(([stats]) => {
				this.$state.statistics = stats;
			});
		},
		updateQuestionConditions(sourceId: string | number) {
			const source = this.$state.questions.find(
				(q) => q.question_id == sourceId,
			);
			if (source == null) {
				return;
			}

			// Get all questions whose condition depends on this question
			const dependents = this.$state.questions.filter(
				(q) => q.question?.conditions?.question_id == sourceId,
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
								source.single_choice?.value?.toString(),
						)
						?.value?.toString(),
				];
			} else if (source.question.type === QuestionType.multi_choice) {
				response = (
					(source.question.choices || []).filter((c) => {
						return this.selectedChoice[c.choice_id]?.selected === true;
					}) || []
				).flatMap((c) => c.value);
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
					continue; // Skip to the next dependent
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
			}
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
			const body = {
				questions: this.$state.questions,
				submit_time: new Date(),
				...extra,
				is_useless: extra.is_useless || false,
				analyst_email: useAccountStore().email,
				transaction: extra.transcription,
			};
			return ApiRequest.post<Analysis>(
				`user-feedback/analysis/${this.$state.survey.id}`,
				body,
			)
				.then(([resp]) => {
					this.$state.statistics.total_analysed += 1;
					this.$state.statistics.by_current_user += body.is_useless ? 0 : 1;
					this.$state.statistics.total_useless += body.is_useless ? 1 : 0;
					this.$state.skipped_messages.push(extra.message_uuid);

					// Reset all responses
					this.resetResponses();
					return resp;
				})
				.finally(() => (this.$state.loading = false));
		},
		async fetchAnalysisReport(messageId?: string) {
			this.loading = true;
			let path = `user-feedback/analysis/${this.$state.survey.id}/report?language=${
				useAppStore().userFeedback.language
			}&deployment=${useAppStore().userFeedback.deployment}`;

			if (messageId != null) {
				path += `&message_id=${messageId}`;
			}

			return ApiRequest.get<{
				headers: Array<{ header: string; key: string; width?: number }>;
				rows: Record<string, any>[];
			}>(path)
				.finally(() => (this.$state.loading = false))
				.catch((err) => {
					notification.error({
						message: "Error",
						description: err.message,
					});

					throw err;
				});
		},
		async fetchSubmittedMessages() {
			if (this.$state.survey?.id == null) {
				return [];
			}

			this.loading = true;
			return ApiRequest.get<UserFeedbackMessage>(
				`user-feedback/analysis/${this.$state.survey.id}/submissions?language=${
					useAppStore().userFeedback.language
				}&deployment=${useAppStore().userFeedback.deployment}`,
			)
				.finally(() => (this.$state.loading = false))
				.catch((err) => {
					notification.error({
						message: "Error",
						description: err.message,
					});

					throw err;
				});
		},
		async deleteSubmission(message_id: string) {
			this.loading = true;
			return ApiRequest.delete<UserFeedbackMessage>(
				`user-feedback/analysis/${this.$state.survey.id}/submissions/${message_id}`,
			)
				.finally(() => (this.$state.loading = false))
				.catch((err) => {
					notification.error({
						message: "Error",
						description: err.message,
					});

					throw err;
				});
		},
		async fetchSampleMessages() {
			this.loading = true;
			return ApiRequest.get<UserFeedbackMessage>(
				`user-feedback/messages/${useAppStore().programCode}/samples?language=${
					useAppStore().userFeedback.language
				}&deployment=${useAppStore().userFeedback.deployment}`,
			)
				.finally(() => (this.$state.loading = false))
				.catch((err) => {
					notification.error({
						message: "Error",
						description: err.message,
					});

					throw err;
				});
		},
		async transcribeMessage(form: {
			message_id: string;
			transcription: string;
		}) {
			this.loading = true;
			return ApiRequest.post<UserFeedbackMessage>(
				`user-feedback/messages/${useAppStore().programCode}/transcribe`,
				form,
			)
				.then(([resp]) => {
					notification.success({
						message: "Success",
						description: "Message transcription saved successfully!",
					});
					return resp;
				})
				.finally(() => (this.$state.loading = false))
				.catch((err) => {
					notification.error({
						message: "Error",
						description: err.message,
					});

					throw err;
				});
		},
		async markAsNotFeedback(message_id: string) {
			this.loading = true;
			return ApiRequest.post<UserFeedbackMessage>(
				`user-feedback/messages/${useAppStore().programCode}/not-feedback/${message_id}`,
				{},
			)
				.then(([resp]) => {
					notification.success({
						message: "Success",
						description: "Message has been marked as not feedback!",
					});
					return resp;
				})
				.finally(() => (this.$state.loading = false))
				.catch((err) => {
					notification.error({
						message: "Error",
						description: err.message,
					});

					throw err;
				});
		},
	},
});
