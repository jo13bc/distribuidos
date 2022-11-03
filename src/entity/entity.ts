export class Entity {
  _id?: any;
  image: string;
  constructor(_id: any | undefined, image: string) {
    this._id = _id;
    this.image = image;
  }
}
