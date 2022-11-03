export class File extends Audio {
  _id?: any;

  constructor(
    _id?: any,
    file?: any,
  ) {
    super(`data:audio/mpeg;base64,${file}`);
    this._id = _id;
  }
}
