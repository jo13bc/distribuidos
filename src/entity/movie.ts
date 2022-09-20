import { Entity } from "./entity";

export class Movie extends Entity {
  name?: string;
  directorId?: number;
  studies: Array<number>;
  image?: string;

  constructor(
    id: number | undefined = undefined,
    name: string | undefined = undefined,
    directorId: number | undefined = undefined,
    studies: Array<number> = new Array<number>(),
    image: string | undefined = 'default.png'
  ) {
    super(id);
    this.name = name;
    this.directorId = directorId;
    this.studies = studies;
    this.image = image;
  }

  static clone(m: Movie): Movie {
    return new Movie(m.id, m.name, m.directorId, m.studies, m.image);
  }
}
