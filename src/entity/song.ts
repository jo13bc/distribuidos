import { Entity } from "./entity";
import { File } from "./file";

export class Song extends Entity {
  playlist?: any;
  name?: string;
  author?: string;
  album?: string;
  url?: string;
  urlFile?: string;
  image: string;

  constructor(
    _id?: any,
    playlist?: any,
    name?: string,
    author?: string,
    album?: string,
    url?: string,
    urlFile?: string,
    image: string = 'default.png'
  ) {
    super(_id);
    this.playlist = playlist;
    this.name = name;
    this.author = author;
    this.album = album;
    this.url = url;
    this.urlFile = urlFile;
    this.image = image;
  }

  static clone(s: Song): Song {
    return new Song(s._id, s.playlist, s.name, s.author, s.album, s.url, s.image);
  }

  toJSON(): string {
    return JSON.stringify({
      _id: this._id,
      playlist: this.playlist,
      name: this.name,
      author: this.author,
      album: this.album,
      url: this.url,
      urlFile: this.urlFile,
      image: this.image
    });
  }
}
