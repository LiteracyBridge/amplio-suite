import { FormProps } from "./survey";

export enum QuestionType {
  open_ended = "open_ended",
  // number = "number", // remove
  // date = "date", // remove
  // time = "time", // remove
  boolean = "boolean",
  multi_choice = "multi_choice",
  // scale = "scale", // remove
  single_choice = "single_choice",
  default = "default"
}

export const QuestionTypesList = [
  { value: QuestionType.open_ended, label: "Open Ended" },
  { value: QuestionType.multi_choice, label: "Multiple Choice (Select Many)" },
  { value: QuestionType.single_choice, label: "Single Choice (Select One)" }
];

export class QuestionSection extends FormProps {
  id?: string;
  survey_id?: number | string;
  name: string;
}

export class QuestionChoice extends FormProps {
  choice_id: string | number;
  value: any;
  is_other: boolean;
  order: number;
  question_id: string | number;
  parent_id?: string | number;
  sub_options?: QuestionChoice[] = [];
}

export class Question extends FormProps {
  id?: string;
  parent_id?: string | number;
  section_id: string | number; // change to 'section'
  question_label?: string;
  // body?: string;
  type?: QuestionType;
  // section?: string; // todo: change to name
  // multiSelect?: boolean = false;
  // characterLimited?: boolean = false;
  // hasMinMax?: boolean = false;
  // allowDecimals?: boolean = false;
  // hasUnits?: boolean = false;
  // reportable?: boolean = false;
  order?: number;
  required?: boolean;
  // minValue?: 1;
  // maxValue?: 8;
  // labels?: [];
  // dateFormat?: "MM/DD/YYYY";
  // timeFormat?: "12";
  // intervals?: 2;
  // textLimit?: 1024;
  // units?: number;

  choices: QuestionChoice[] = [];

  conditions: QuestionCondition;
  sub_questions: Question[] = [];

  constructor(init?: Partial<Question>) {
    super(init);
    Object.assign(this, init);
  }

  static fromJson(obj: Partial<Question>) {
    return new Question({
      ...obj
    });
  }

  static create(type: QuestionType, sectionId?: string) {
    return new Question({
      section_id: sectionId,
      type: type,
      choices:
        type == QuestionType.open_ended
          ? []
          : [
              {
                value: "Option 1",
                order: 1,
                is_other: false,
                choice_id: self.crypto.randomUUID(),
                question_id: null,
                is_new: true
              },
              {
                value: "Option 2",
                order: 2,
                is_other: false,
                choice_id: self.crypto.randomUUID(),
                question_id: null,
                is_new: true
              }
            ]
    });
  }
}

export class QuestionCondition extends FormProps {
  id: number;
  question_id: number | string;
  condition: DependentCondition;
  // TODO: change to array
  value: string;
  action: ConditionAction;

  constructor(init?: Partial<QuestionCondition>) {
    super(init);
    Object.assign(this, init);
  }
}

export enum DependentCondition {
  equals = "equals",
  not_equals = "not_equals",
  greater_than = "greater_than",
  less_than = "less_than",
  greater_than_or_equal_to = "greater_than_or_equal_to",
  less_than_or_equal_to = "less_than_or_equal_to",
  contains = "contains",
  not_contains = "not_contains",
  is_empty = "is_empty",
  is_not_empty = "is_not_empty"
}

export enum ConditionAction {
  show = "show",
  hide = "hide",
  required = "required",
  enable = "enable",
  disable = "disable",
  not_required = "not_required"
}
