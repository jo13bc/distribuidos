export class Entity {
  id?: number;
  image: string;
  constructor(id: number | undefined, image: string) {
    this.id = id;
    this.image = image;
  }
}
