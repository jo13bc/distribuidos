import { Movie } from "../entity/movie";
import { Study } from "../entity/study";
import { Service } from "./service";
import { Response } from "../entity/response";
import { ObjectId } from "mongodb";

export class StudyService extends Service<Study> {
  constructor() {
    super("study");
  }

  async listMovies(_id: ObjectId): Promise<Array<Movie> | undefined> {
    return new Promise<Array<Movie> | undefined>((resolve, reject) => {
      fetch(
        `/.netlify/functions/movie/byStudy/${_id}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }).then((response) => response.json())
        .then((response: Response<Array<Movie> | undefined>) => {
          if (response.status == 200) {
            resolve(response.body);
          } else {
            if (!response.status) {
              throw (response as any).errorMessage;
            }
            reject(response);
          }
        }).catch(error => {
          reject(new Response<any>(404, error.message, error));
        });
    });
  }
}
