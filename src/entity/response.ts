export class Response<T> {
  status: number;
  message: string;
  body: T;
  constructor(status: number, message: string, body: T) {
    this.status = status;
    this.message = message;
    this.body = body;
  }
}
