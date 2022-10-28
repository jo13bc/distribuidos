import { Director } from "src/entity/director";
import { Movie } from "src/entity/movie";
import { Service } from "./service";
import { Response } from "src/entity/response";

export class DirectorService extends Service<Director> {
  constructor() {
    super("director");
  }

  async listMovies(_id: string): Promise<Array<Movie>> {
    return new Promise<Array<Movie>>((resolve, reject) => {
      fetch(
        `/.netlify/functions/movie/byDirector/${_id}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }).then((response) => response.json())
        .then((response: Response<Array<Movie>>) => {
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
