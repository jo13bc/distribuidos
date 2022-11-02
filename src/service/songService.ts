import { Song } from "src/entity/song";
import { Service } from "./service";

export class SongService extends Service<Song> {
  constructor() {
    super("song");
  }
}
