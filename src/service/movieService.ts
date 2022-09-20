import { Director } from "src/entity/director";
import { Movie } from "src/entity/movie";
import { Study } from "src/entity/study";
import { Service } from "./service";

export class MovieService extends Service<Movie> {
  constructor() {
    super("movie");
  }

  async listStydies(id: number): Promise<Array<Study>> {
    return await fetch(
      `/.netlify/functions/${
        this.entity_name
      }/${id}/studies/`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }
    ).then((response) => response.json());
  }

  async listDirector(id: number): Promise<Director> {
    return await fetch(
      `/.netlify/functions/${
        this.entity_name
      }/${id}/director/`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }
    ).then((response) => response.json());
  }
}
