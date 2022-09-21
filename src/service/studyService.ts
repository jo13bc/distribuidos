import { Movie } from "src/entity/movie";
import { Study } from "src/entity/study";
import { Service } from "./service";

export class StudyService extends Service<Study> {
  constructor() {
    super("study");
  }

  async listMovies(ids: Array<number>): Promise<Array<Movie>> {
    return await fetch(
      `/.netlify/functions/movie/[${ids}]/byStudy/`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }
    ).then((response) => response.json());
  }
}
