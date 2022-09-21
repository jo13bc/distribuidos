import { Entity } from "./entity";

export class Study extends Entity {
  name?: string;
  movies: Array<number>;

  constructor(
    id: number | undefined = undefined,
    name: string | undefined = undefined,
    movies: Array<number> = new Array<number>(),
    image: string = 'default.png'
  ) {
    super(id, image);
    this.name = name;
    this.movies = movies;
  }

  static clone(s: Study): Study {
    return new Study(s.id, s.name, s.movies, s.image);
  }
}
