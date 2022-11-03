import { Entity } from "../entity/entity";
import { Response } from "src/entity/response";

export class Service<E extends Entity> {
  entity_name: string;
  constructor(entity_name: string) {
    this.entity_name = entity_name;
  }

  async insert(entity: E): Promise<any> {
    return await fetch(`/.netlify/functions/${this.entity_name}`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      body: JSON.stringify(entity),
    }).then((response) => response.json());
  }

  async update(entity: E): Promise<any> {
    return await fetch(`/.netlify/functions/${this.entity_name}/${entity._id}`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      mode: "cors",
      credentials: "same-origin",
      body: JSON.stringify(entity),
    }).then((response) => response.json());
  }

  async delete(_id: any): Promise<any> {
    return await fetch(`/.netlify/functions/${this.entity_name}/${_id}`, {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
      mode: "cors",
      credentials: "same-origin",
    }).then((response) => response.json());
  }

  async find(_id: any): Promise<E> {
    return new Promise<E>((resolve, reject) => {
      fetch(`/.netlify/functions/${this.entity_name}/${_id}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }).then((response) => response.json())
        .then(response => {
          if (response.status === 200) {
            resolve(response.body);
          } else {
            reject(response);
          }
        }).catch(error => {
          reject(error);
        });
    });
  }

  list(): Promise<Array<E>> {
    return new Promise<Array<E>>((resolve, reject) => {
      fetch(`/.netlify/functions/${this.entity_name}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      }).then((response) => response.json())
        .then(response => {
          if (response.status === 200) {
            resolve(response.body);
          } else {
            reject(response);
          }
        }).catch(error => {
          reject(error);
        });
    });
  }
}
