import { User } from "src/entity/user";
import { Service } from "./service";
import { Response } from "src/entity/response";

export class UserService extends Service<User> {
  constructor() {
    super("user");
  }

  async login(user: User): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      fetch(
        `/.netlify/functions/user/login`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        body: JSON.stringify(user)
      }).then((response) => response.json())
        .then((response: Response<User>) => {
          if (response.status === 200) {
            resolve(response.body as User);
          } else {
            reject(response);
          }
        }).catch(error => {
          reject(error);
        });
    });
  }
}
