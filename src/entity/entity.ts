import { ObjectId } from "mongodb";

export class Entity {
  _id?: ObjectId;
  image: string;
  constructor(_id: ObjectId | undefined, image: string) {
    this._id = _id;
    this.image = image;
  }
}
