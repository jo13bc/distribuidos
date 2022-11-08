import { Entity } from "./entity";

export class File extends Audio implements Entity {
  _id?: any;
  url?: string;
  constructor(
    _id?: any,
    src?: string
  ) {
    super(`data:audio/mpeg;base64,${src}`);
    this._id = _id;
  }

  static Clone(file?: File): File {
    return file ? new File(file._id, file.src) : new File();
  }

  toJSON() {
    return JSON.stringify({ _id: this._id });
  }
}
