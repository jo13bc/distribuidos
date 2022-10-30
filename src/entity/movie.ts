import { ObjectId } from "mongodb";
import { Entity } from "./entity";

export class Movie extends Entity {
  name?: string;
  directorId?: ObjectId;
  studies: Array<ObjectId>;

  constructor(
    _id: ObjectId | undefined = undefined,
    name: string | undefined = undefined,
    directorId: ObjectId | undefined = undefined,
    studies: Array<ObjectId> = new Array<ObjectId>(),
    image: string | undefined = 'default.png'
  ) {
    super(_id, image);
    this.name = name;
    this.directorId = directorId;
    this.studies = studies;
    this.image = image;
  }

  static clone(m: Movie): Movie {
    return new Movie(m._id, m.name, m.directorId, m.studies, m.image);
  }
}
