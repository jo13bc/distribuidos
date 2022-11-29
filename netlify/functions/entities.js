import { Entity, Schema } from "redis-om";

class EntityBase extends Entity {};

export const directorSchema = new Schema(EntityBase, {
  name: { type: "string" },
  birth_year: { type: "string" },
  nationality: { type: "string" },
  image: { type: "string" }
});

export const studySchema = new Schema(EntityBase, {
  name: { type: "string" },
  image: { type: "string" }
});

export const movieSchema = new Schema(EntityBase, {
  name: { type: "string" },
  directoId: { type: "string" },
  studies: { type: "string" },
  image: { type: "string" }
});