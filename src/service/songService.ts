import { File } from "src/entity/file";
import { Song } from "src/entity/song";
import { Service } from "./service";

export class SongService extends Service<Song> {
  constructor() {
    super("song");
  }

  async findFile(_id: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fetch(`/.netlify/functions/song/file/${_id}`, {
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
