import { File } from "../entity/file";
import { Song } from "../entity/song";
import { RabbitService } from "./rabbitService";
import { Service } from "./service";

export class SongService extends Service<Song> {
  rabbitService: RabbitService;

  constructor() {
    super("song");
    this.rabbitService = new RabbitService();
  }

  async insert(entity: Song): Promise<any> {
    return await this.rabbitService.insert(entity);
  }

  async update(entity: Song): Promise<any> {
    return await this.rabbitService.update(entity);
  }

  async delete(_id: any): Promise<any> {
    return await this.rabbitService.delete(_id);;
  }

  async findFile(_id: any): Promise<File> {
    return new Promise<File>((resolve, reject) => {
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
