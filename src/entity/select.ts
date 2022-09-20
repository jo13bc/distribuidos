export class Select {
  text?: string;
  value?: number;
  constructor(text: string | undefined, value: number | undefined) {
    this.text = text;
    this.value = value;
  }
}