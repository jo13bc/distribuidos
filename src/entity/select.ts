import { ObjectId } from "mongodb";

export class Select {
  text?: string;
  value?: ObjectId;
  constructor(text: string | undefined, value: ObjectId | undefined) {
    this.text = text;
    this.value = value;
  }
}