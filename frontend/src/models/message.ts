import { SdgGoal } from "./sdg_goal";

export class Message {
  id: number;
  program_id: string;
  playlist_id: number;
  position: number;
  title: string = "";
  format?: string = "";
  default_category_code: string = "";
  variant?: string = "";
  sdg_goal_id?: number;
  sdg_target?: string = "";
  key_points?: string = "";
  sdg_target_id?: number;
  languages: string = "";

  audience?: string = "";
  sdg_goal: SdgGoal;

  static create(position: number) {
    const message = new Message();
    message.position = position;

    return message;
  }
}
