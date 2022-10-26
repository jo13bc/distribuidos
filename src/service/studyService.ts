import { Movie } from "src/entity/movie";
import { Study } from "src/entity/study";
import { Service } from "./service";
import { Response } from "src/entity/response";

export class StudyService extends Service<Study> {
  constructor() {
    super("study");
  }

  async listMovies(id: number): Promise<Array<Movie>> {
    return new Promise<Array<Movie>>((resolve, reject) => {
      fetch(
        `/.netlify/functions/movie/byStudy/${id}`, {
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
