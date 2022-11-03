export class Select {
  text?: string;
  value?: any;
  constructor(text: string | undefined, value: any | undefined) {
    this.text = text;
    this.value = value;
  }
}