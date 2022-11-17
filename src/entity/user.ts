import { ObjectId } from "mongodb";
import { Entity } from "./entity";

export class User extends Entity {
  username?: string;
  password?: string;
  token?: string;

  constructor(
    _id: ObjectId | undefined = undefined,
    username: string | undefined = undefined,
    password: string | undefined = undefined,
    token: string | undefined = undefined,
    image: string = 'default.png'
  ) {
    super(_id, image);
    this.username = username;
    this.password = password;
    this.token = token;
  }
  static clone(d: User): any {
    return new User(
      d._id,
      d.username,
      d.password,
      d.token,
      d.image
    );
  }
}
