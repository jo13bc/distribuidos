import { Entity } from "./entity";
import { File } from "./file";

export class Song extends Entity {
  playlist?: any;
  name?: string;
  author?: string;
  album?: string;
  url?: string;
  file?: File;

  constructor(
    _id?: any,
    playlist?: any,
    name?: string,
    author?: string,
    album?: string,
    url?: string,
    file?: File | string,
    image: string = 'default.png'
  ) {
    super(_id, image);
    this.playlist = playlist;
    this.name = name;
    this.author = author;
    this.album = album;
    this.url = url;
    this.file = typeof file == 'string' ? new File(file) : file;
  }

  static clone(s: Song): Song {
    return new Song(s._id, s.playlist, s.name, s.author, s.album, s.url, s.file, s.image);
  }
}
