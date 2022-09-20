export class Entry<V> {
  name: string;
  value: V;
  constructor(name: string, value: V) {
    this.name = name;
    this.value = value;
  }
}