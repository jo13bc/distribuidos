import { ObjectId } from "mongodb";
import { Entity } from "./entity";

export class Song extends Entity {
  playlist?: ObjectId;
  name?: string;
  author?: string;
  album?: string;
  url?: string;
  isPlay: boolean;

  constructor(
    _id?: ObjectId,
    playlist?: ObjectId,
    name?: string,
    author?: string,
    album?: string,
    url?: string,
    image: string = 'default.png',
    isPlay: boolean = false
  ) {
    super(_id, image);
    this.playlist = playlist;
    this.name = name;
    this.author = author;
    this.album = album;
    this.url = url;
    this.isPlay = isPlay;
  }

  static clone(s: Song): Song {
    return new Song(s._id, s.playlist, s.name, s.author, s.album, s.image);
  }
}
