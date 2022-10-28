export class Entity {
  _id?: string;
  image: string;
  constructor(_id: string | undefined, image: string) {
    this._id = _id;
    this.image = image;
  }
}
