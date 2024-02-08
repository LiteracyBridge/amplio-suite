import { Deployment } from "./deployment";
import { Question, QuestionSection } from "./question";

export class FormProps {
  // Form properties
  is_new?: boolean = false;
  is_updated?: boolean = false;
  is_deleted?: boolean = false;

  constructor(init?: Partial<FormProps>) {
    Object.assign(this, init);
  }
}

export enum SurveyStatus {
  draft = "draft",
  published = "published",
  archived = "archived"
}

export class Survey extends FormProps {
  id: string | number;
  name: string;
  description: string;
  project_code: string | number;
  deployment_id: string | number;
  language: string;
  status: SurveyStatus = SurveyStatus.draft;

  deployment?: Deployment;
  questions: Question[] = [];
  sections: QuestionSection[] = [];

  constructor(init?: Partial<Survey>) {
    super(init);
    Object.assign(this, init);
  }
}
