import { Director } from "src/entity/director";
import { Movie } from "src/entity/movie";
import { Service } from "./service";

export class DirectorService extends Service<Director> {
  constructor() {
    super("director");
  }

  async listMovies(ids: Array<number>): Promise<Array<Movie>> {
    return await fetch(
      `/.netlify/functions/movie/[${ids}]/byDirector/`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }
    ).then((response) => response.json());
  }
}
