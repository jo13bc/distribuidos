import { Director } from "src/entity/director";
import { Movie } from "src/entity/movie";
import { Service } from "./service";

export class DirectorService extends Service<Director> {
  constructor() {
    super("director");
  }

  async listMovies(id: number): Promise<Array<Movie>> {
    return await fetch(
      `/.netlify/functions/${
        this.entity_name
      }/${id}/movies/`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }
    ).then((response) => response.json());
  }
}
