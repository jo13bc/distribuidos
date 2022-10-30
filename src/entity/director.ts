import { ObjectId } from "mongodb";
import { Entity } from "./entity";

export class Director extends Entity {
  name?: string;
  birth_year?: string;
  nationality?: string;

  constructor(
    _id: ObjectId | undefined = undefined,
    name: string | undefined = undefined,
    birth_year: string | undefined = undefined,
    nationality: string | undefined = undefined,
    image: string | undefined = 'default.png'
  ) {
    super(_id, image);
    this.name = name;
    this.birth_year = birth_year;
    this.nationality = nationality;
    this.image = image;
  }
  static clone(d: Director): any {
    return new Director(
      d._id,
      d.name,
      d.birth_year,
      d.nationality,
      d.image
    );
  }
}
