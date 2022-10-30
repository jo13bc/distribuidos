import { ObjectId } from "mongodb";
import { Entity } from "./entity";

export class Study extends Entity {
  name?: string;

  constructor(
    _id: ObjectId | undefined = undefined,
    name: string | undefined = undefined,
    image: string = 'default.png'
  ) {
    super(_id, image);
    this.name = name;
  }

  static clone(s: Study): Study {
    return new Study(s._id, s.name, s.image);
  }
}
