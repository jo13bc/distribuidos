import { Entity } from "./entity";

export class Playlist extends Entity {
  name?: string;
  date?: Date;
  image: string;

  constructor(
    _id?: any,
    name?: string,
    date?: Date,
    image: string = 'default.png'
  ) {
    super(_id);
    this.name = name;
    this.date = date;
    this.image = image;
  }

  static clone(s: Playlist): Playlist {
    return new Playlist(s._id, s.name, s.date, s.image);
  }

  toJSON(): string {
    return JSON.stringify({
        _id: this._id, name: this.name, date: this.date, image: this.image
      }
    );
  }
}
