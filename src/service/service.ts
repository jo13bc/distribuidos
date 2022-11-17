import { ObjectId } from "mongodb";
import { Entity } from "../entity/entity";
import { Response } from "../entity/response";

export class Service<E extends Entity> {
  entity_name: string;
  constructor(entity_name: string) {
    this.entity_name = entity_name;
  }

  async insert(entity: E): Promise<any | undefined> {
    return new Promise<any | undefined>((resolve, reject) => {
      fetch(`/.netlify/functions/${this.entity_name}`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        body: JSON.stringify(entity),
      }).then((response) => response.json())
        .then((response: Response<any | undefined>) => {
          if (response.status === 200) {
            resolve(response.body);
          } else {
            reject(response);
          }
        }).catch(error => {
          reject(new Response<any>(404, error.errorMessage, error));
        });
    });
  }

  async update(entity: E): Promise<any | undefined> {
    return new Promise<any | undefined>((resolve, reject) => {
      fetch(`/.netlify/functions/${this.entity_name}/${entity._id}`, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        mode: "cors",
        credentials: "same-origin",
        body: JSON.stringify(entity),
      }).then((response) => response.json())
        .then((response: Response<any | undefined>) => {
          if (response.status === 200) {
            resolve(response.body);
          } else {
            reject(response);
          }
        }).catch(error => {
          reject(new Response<any>(404, error.errorMessage, error));
        });
    });
  }

  async delete(_id: ObjectId): Promise<any | undefined> {
    return new Promise<any | undefined>((resolve, reject) => {
      fetch(`/.netlify/functions/${this.entity_name}/${_id}`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        mode: "cors",
        credentials: "same-origin",
      }).then((response) => response.json())
        .then((response: Response<any | undefined>) => {
          if (response.status === 200) {
            resolve(response.body);
          } else {
            reject(response);
          }
        }).catch(error => {
          reject(new Response<any>(404, error.errorMessage, error));
        });
    });
  }

  async find(_id: ObjectId): Promise<E | undefined> {
    return new Promise<E | undefined>((resolve, reject) => {
      fetch(`/.netlify/functions/${this.entity_name}/${_id}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }).then((response) => response.json())
        .then((response: Response<E | undefined>) => {
          if (response.status === 200) {
            resolve(response.body);
          } else {
            reject(response);
          }
        }).catch(error => {
          reject(new Response<any>(404, error.errorMessage, error));
        });
    });
  }

  list(): Promise<Array<E> | undefined> {
    return new Promise<Array<E> | undefined>((resolve, reject) => {
      fetch(`/.netlify/functions/${this.entity_name}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }).then((response) => response.json())
        .then((response: Response<Array<E> | undefined>) => {
          if (response.status === 200) {
            resolve(response.body);
          } else {
            reject(response);
          }
        }).catch(error => {
          reject(new Response<any>(404, error.errorMessage, error));
        });
    });
  }
}
