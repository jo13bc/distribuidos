<template>
  <main>
    <h2>{{entity_name?.value}}</h2>
    <b-table :items="entities" :fields="table_header" responsive>
      <template #cell(image)="data">
        <b-img rounded="circle" v-bind="mainProps" v-bind:src="loadImage(data.value)" />
      </template>
      <template #cell(nameid)="data">
        <b-link v-b-modal.entityModal @click="loadEntity(ACTION.detail, data.item.id)">
          {{data.item.name}}
        </b-link>
      </template>
      <template #cell(id)="data">
        <b-link v-b-modal.entityModal @click="loadEntity(ACTION.update, data.value)">
          <fa-icon icon="fa-solid fa-pen" size="xl" />
        </b-link>
        <b-link @click="deleteEntity(data.value)" class="m-3">
          <fa-icon icon="fa-solid fa-trash" size="xl" />
        </b-link>
      </template>
    </b-table>
    <b-button variant="primary" @click="loadEntity(ACTION.insert)" v-b-modal.entityModal class="mb-3">Nuevo</b-button>
    <detail ref="entityModal" :title="action_name" :entity="entity" :save="() => saveEntity()"
      :showSave="action_name !== ACTION.detail" :cancel="() => cancelEntity()" />
  </main>
</template>
<script lang="ts">
import { Filter } from '../../entity/filter';
import { defineComponent, ref } from 'vue';
import { Entry } from '../../entity/entry';
import { Movie } from '../../entity/movie';
import detail from './detail.vue';
import { MovieService } from '../../service/movieService';
import Swal from 'sweetalert2'
const TABLE_HEADER = [
  new Filter("image", "Fotografía"),
  new Filter("nameid", "Nombre"),
  new Filter("id", "Acciones")
];

const ACTION = {
  insert: "Insertar",
  update: "Actualizar",
  delete: "Eliminar",
  detail: "Detalle"
}

const SWALTYPE = {
  err: { type: 'error', title: 'Error' },
  succ: { type: 'success', title: 'Éxito' },
  warn: { type: 'waring', title: 'Advertencia' }
}

function swal(message: any) {
  let type: any = SWALTYPE.succ;
  switch (message.code) {
    case 404: {
      type = SWALTYPE.err;
    }
  }
  return {
    icon: type.type,
    title: type.title,
    text: message.message
  };
}

const ENTITY_NAME = new Entry<string>("movie", "Película");
let entity: Movie = new Movie();
export default defineComponent({
  data() {
    return {
      table_header: TABLE_HEADER,
      entity_name: ENTITY_NAME,
      entities: new Array<Movie>(),
      action_name: ACTION.insert,
      entity,
      service: new MovieService(),
      ACTION,
      mainProps: { blank: false, width: 45, height: 45 }
    };
  },
  created() {
    this.allEntities();
  },
  methods: {
    loadImage(url: string): string {
      return `/image/movie/` + url;
    },
    cancelEntity() {
      this.entity = new Movie();
    },
    loadEntity(action: string, id: number | undefined = undefined): void {
      this.action_name = action;
      if (entity === undefined) {
        this.entity = new Movie();
      } else {
        let entity = this.entities.filter(e => e.id === id)[0];
        this.entity = Movie.clone(entity);
      }
    },
    saveEntity(): void {
      if (this.entity.id === undefined) {
        this.service.insert(this.entity)
          .then(message => Swal.fire(swal(message)))
          .catch(err => Swal.fire(swal(err)))
          .finally(this.allEntities);
      } else {
        this.service.update(this.entity)
          .then(message => Swal.fire(swal(message)))
          .catch(err => Swal.fire(swal(err)))
          .finally(this.allEntities);
      }
    },
    allEntities(): void {
      this.service.list()
        .then(result => this.entities = result);
    },
    deleteEntity(id: any): void {
      this.service.delete(id)
        .then(message => Swal.fire(swal(message)))
        .catch(err => Swal.fire(swal(err)))
        .finally(this.allEntities);
    }
  },
  components: { detail }
});
</script>