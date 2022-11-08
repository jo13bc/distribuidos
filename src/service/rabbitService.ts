import { File } from "../entity/file";
import { Song } from "../entity/song";
import { Service } from "./service";
import { Response } from "../entity/response";

export class RabbitService {

  async insert(entity: Song): Promise<any> {
    return await fetch(`/.netlify/functions/rabbit`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      body: entity.toJSON(),
    }).then((response) => response.json());
  }

  async update(entity: Song): Promise<any> {
    return await fetch(`/.netlify/functions/rabbit/${entity._id}`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      mode: "cors",
      credentials: "same-origin",
      body: entity.toJSON(),
    }).then((response) => response.json());
  }

  async delete(_id: any): Promise<any> {
    return await fetch(`/.netlify/functions/rabbit/${_id}`, {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
      mode: "cors",
      credentials: "same-origin",
    }).then((response) => response.json());
  }

  async runtask(): Promise<Response<Song>> {
    return await fetch(`/.netlify/functions/rabbit/`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    }).then((response) => response.json());
  }
}
