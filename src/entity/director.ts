import { Entity } from "./entity";

export class Director extends Entity {
  name?: string;
  birth_year?: string;
  nationality?: string;
  movies: Array<number>;
  image?: string;

  constructor(
    id: number | undefined = undefined,
    name: string | undefined = undefined,
    birth_year: string | undefined = undefined,
    nationality: string | undefined = undefined,
    movies: Array<number> = new Array<number>(),
    image: string | undefined = 'default.png'
  ) {
    super(id);
    this.name = name;
    this.birth_year = birth_year;
    this.nationality = nationality;
    this.movies = movies;
    this.image = image;
  }
  static clone(d: Director): any {
    return new Director(
      d.id,
      d.name,
      d.birth_year,
      d.nationality,
      d.movies,
      d.image
    );
  }
}
