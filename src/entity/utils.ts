import { ObjectId } from 'mongodb';
import { Response } from './response';

export const ACTION = {
  insert: "Insertar",
  update: "Actualizar",
  delete: "Eliminar",
  detail: "Detalle",
};

export const ENTITY = {
  movie: {
    name: "movie",
    title: "Catálogo de Películas",
    insert: `${ACTION.insert} Película`,
    update: `${ACTION.update} Película`,
    detail: `${ACTION.detail} Película`,
  },
  study: {
    name: "study",
    title: "Catálogo de Estudios",
    insert: `${ACTION.insert} Estudio`,
    update: `${ACTION.update} Estudio`,
    detail: `${ACTION.detail} Estudio`,
  },
  director: {
    name: "director",
    title: "Catálogo de Directores",
    insert: `${ACTION.insert} Director`,
    update: `${ACTION.update} Director`,
    detail: `${ACTION.detail} Director`,
  },
};

const SWALTYPE = {
  err: { type: "error", title: "Mensaje de Error" },
  succ: { type: "success", title: "Mensaje de Información" },
  warn: { type: "warning", title: "Mensaje de Advertencia" },
};

export function swal(response: Response<any>): any {
  let type: any = SWALTYPE.succ;
  if (response.status == 0) {
    type = SWALTYPE.warn;
  } else if (!response.status || response.status >= 400) {
    type = SWALTYPE.err;
  }
  return type != SWALTYPE.warn ? {
    icon: type.type,
    title: type.title,
    text: response.message,
  } : {
    icon: type.type,
    title: type.title,
    text: response.message,
    showDenyButton: true,
    confirmButtonText: 'Sí',
    denyButtonText: 'No',
  };
}

export function loadImage(name: string, entity: string, route: any) {
  let root = route.fullPath.split("/")[0];
  return `${root}/image/${entity}/${name}`;
}

export function loadEntity(
  action: string,
  entity: string,
  _id: ObjectId | undefined = undefined
): string {
  if (_id === undefined) return `/${entity}/new`;
  return `/${entity}/${action === ACTION.update ? "edit" : "show"}/${_id}`;
}

export const tableImage = { blank: false, width: 45, height: 45 };

export const detailImage = { blank: false, width: 150, height: 150 };
