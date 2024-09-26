// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import type { Message } from "./message";
import type { Deployment } from "./deployment";

export class Playlist {
  _id: string;
  id: number;
  program_id: string;
  deployment_id: string; // uuid
  position: number;
  title: string;
  audience?: string;

  messages: Message[] = [];

  static create(position: number, deployment: Deployment) {
    const playlist = new Playlist();

    playlist.deployment_id = deployment._id
    playlist._id = crypto.randomUUID()
    playlist.position = position;
    playlist.title = "";
    playlist.audience = "";
    playlist.messages = [];

    return playlist;
  }
}
