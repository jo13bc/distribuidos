import { Entity } from "../entity/entity";

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
    return await fetch(`/.netlify/functions/${this.entity_name}/${entity.id}`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      mode: "cors",
      credentials: "same-origin",
      body: JSON.stringify(entity),
    }).then((response) => response.json());
  }

  async delete(id: number): Promise<any> {
    return await fetch(`/.netlify/functions/${this.entity_name}/${id}`, {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
      mode: "cors",
      credentials: "same-origin",
    }).then((response) => response.json());
  }

  async find(id: number): Promise<E> {
    return await fetch(`/.netlify/functions/${this.entity_name}/${id}`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    }).then((response) => response.json());
  }

  async list(): Promise<Array<E>> {
    return await fetch(`/.netlify/functions/${this.entity_name}`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    }).then((response) => response.json());
  }
}
