import { ContentMetadata } from "./content_metadata";
import { Recipient } from "./recipient";

export class UserFeedbackMessage {
  message_uuid: string;
  program_id: string;
  deployment_number: string;
  language: string;
  length_seconds: number;
  length_bytes: number;
  transcription: string;
  is_useless: boolean = false;
  relation: string;
  recipient_id: string;

  recipient: Recipient;
  content_metadata: ContentMetadata;
}
