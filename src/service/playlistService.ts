import { Playlist } from "src/entity/playlist";
import { Song } from "src/entity/song";
import { Service } from "./service";

export class PlaylistService extends Service<Playlist> {
  constructor() {
    super("playlist");
  }

  async listSong(_id: any): Promise<Song[]> {
    return new Promise<Song[]>((resolve, reject) => {
      fetch(`/.netlify/functions/song/byPlaylist/${_id}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }).then((response) => response.json())
        .then(response => {
          if (response.status === 200) {
            resolve(response.body);
          } else {
            reject(response);
          }
        }).catch(error => {
          reject(error);
        });
    });
  }
}
