import type { Playlist } from "./playlist";
import { SdgGoal } from "./sdg_goal";

export class Message {
  _id: string; // uuid
  id: number;
  program_id: string;
  playlist_id: number | string; // uuid for string
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

  static create(position: number, playlist: Playlist) {
    const message = new Message();

    message.playlist_id = playlist._id;
    message._id = crypto.randomUUID()
    message.position = position;

    return message;
  }
}
