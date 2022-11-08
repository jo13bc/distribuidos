export abstract class Entity {
  _id?: any;
  constructor(_id: any | undefined) {
    this._id = _id;
  }
  abstract toJSON(): string;  
}
