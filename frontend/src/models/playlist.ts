import { Message } from "./message";

export class Playlist {
  id: number;
  program_id: string;
  deployment_id: number;
  position: number;
  title: string;
  audience?: string;

  messages: Message[] = [];

  static create(position: number) {
    const playlist = new Playlist();

    playlist.position = position;
    playlist.title = "";
    playlist.audience = "";
    playlist.messages = [];

    return playlist;
  }
}
