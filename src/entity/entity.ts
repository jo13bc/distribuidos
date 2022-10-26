export class Entity {
  _id?: number;
  image: string;
  constructor(_id: number | undefined, image: string) {
    this._id = _id;
    this.image = image;
  }
}
