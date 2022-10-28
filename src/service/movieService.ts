import { Director } from "src/entity/director";
import { Movie } from "src/entity/movie";
import { Study } from "src/entity/study";
import { Service } from "./service";
import { Response } from "src/entity/response";

export class MovieService extends Service<Movie> {
  constructor() {
    super("movie");
  }

  async listStydies(_id: string): Promise<Array<Study>> {
    return new Promise<Array<Study>>((resolve, reject) => {
      fetch(`/.netlify/functions/study/byMovie/${_id}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }).then((response) => response.json())
        .then((response: Response<Array<Study>>) => {
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

  async listDirector(_id: string): Promise<Director> {
    return new Promise<Director>((resolve, reject) => {
      fetch(`/.netlify/functions/director/byMovie/${_id}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }).then((response) => response.json())
        .then((response: Response<Director>) => {
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
