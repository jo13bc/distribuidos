import { ObjectId } from "mongodb";
import { Entity } from "./entity";

export class Playlist extends Entity {
  name?: string;
  date?: Date;

  constructor(
    _id?: ObjectId,
    name?: string,
    date?: Date,
    image: string = 'default.png'
  ) {
    super(_id, image);
    this.name = name;
    this.date = date;
  }

  static clone(s: Playlist): Playlist {
    return new Playlist(s._id, s.name, s.date, s.image);
  }
}
