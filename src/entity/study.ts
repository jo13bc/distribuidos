import { Entity } from "./entity";

export class Study extends Entity {
  name?: string;
  movies: Array<number>;
  image?: string;

  constructor(
    id: number | undefined = undefined,
    name: string | undefined = undefined,
    movies: Array<number> = new Array<number>(),
    image: string | undefined = 'default.png'
  ) {
    super(id);
    this.name = name;
    this.movies = movies;
    this.image = image;
  }

  static clone(s: Study): Study {
    return new Study(s.id, s.name, s.movies, s.image);
  }
}
