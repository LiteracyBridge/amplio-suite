import { Question } from "./question";
import { FormProps } from "./survey";

export class Analysis extends FormProps {
  id?: string | number;
  is_useless?: boolean = false;
  message_uuid?: string;
  analyst_email?: string;
  start_time?: string;
  submit_time?: string;
  transcription?: string;

  /**
   * If option is selected, then response is the choice's value,
    else response is the user provided text
   */
  response?: string;
  question_id?: string | number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  question?: Question;

  // These fields are form props
  show: boolean = true;
  error?: string = null;

  /**
   * Multi-choice questions can have multiple choices selected
   * TODO: find a way to save to the database
   */
  choices?: string[] | number[] = [];

  /**
   * This field is to save the choice_id of radio buttons
   */
  // TODO: remove
  // choice_id?: string | number;

  // TODO: Look for better name
  single_choice?: { value: string | number; sub_choice: string | number } = {
    value: null,
    sub_choice: null,
  };
  meta: Record<string, any> = {};
  // choices?: Array<{
  //   analysis_id: string | number;
  //   choice_id: string | number;
  // }> = [];
}

export class Progress {
  totalReceivedMessages: number = -1;
  others_recordings: number = 0;
  users_recordings: number = 0;
  others_feedback: number = 0;
  users_feedback: number = 0;
}

export class AudioMetadata {
  url: string;
  title: string;
  community: string;
  district: string;
  region: string;
  listening_model: string;
  group: string;
  uuid: string;
  filename: string;
  submission: boolean;
}
