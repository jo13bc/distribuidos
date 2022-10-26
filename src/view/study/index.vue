<template>
  <main>
    <h2>{{ $route.meta.title }}</h2>
    <b-table :items="entities" :fields="table_header" responsive>
      <template #cell(image)="data">
        <b-img rounded="circle" v-bind="tableImage" v-bind:src="loadImage(data.value)" />
      </template>
      <template #cell(nameid)="data">
        <b-link @click="loadEntity(ACTION.detail, data.item.id)">
          {{data.item.name}}
        </b-link>
      </template>
      <template #cell(id)="data">
        <b-link @click="loadEntity(ACTION.update, data.value)">
          <fa-icon icon="fa-solid fa-pen" size="xl" />
        </b-link>
        <b-link @click="deleteEntity(data.value)" class="m-3">
          <fa-icon icon="fa-solid fa-trash" size="xl" />
        </b-link>
      </template>
    </b-table>
    <b-button variant="primary" @click="loadEntity(ACTION.insert)">Nuevo</b-button>
  </main>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Filter } from '../../entity/filter';
import { Study } from '../../entity/study';
import { StudyService } from '../../service/studyService';
import Swal from 'sweetalert2';
import { ACTION, ENTITY, swal, tableImage, loadImage, loadEntity } from '../../entity/utils';
import { useRoute } from 'vue-router';

const TABLE_HEADER = [
  new Filter("image", "Fotografía"),
  new Filter("nameid", "Nombre"),
  new Filter("id", "Acciones")
];

export default defineComponent({
  props: ['show'],
  data() {
    return {
      table_header: TABLE_HEADER,
      entities: new Array<Study>(),
      service: new StudyService(),
      ACTION,
      tableImage
    };
  },
  created() {
    this.allEntities();
  },
  methods: {
    loadImage: (n: string) => loadImage(n, ENTITY.study.name, useRoute()),
    loadEntity(a: string, i: number | undefined = undefined) {
      this.$router.push(loadEntity(a, ENTITY.study.name, i))
    },
    allEntities(): void {
      this.service.list()
        .then(result => this.entities = result)
        .catch(err => Swal.fire(swal(err)));
    },
    deleteEntity(id: any): void {
      this.service.delete(id)
        .then(message => Swal.fire(swal(message)))
        .catch(err => Swal.fire(swal(err)))
        .finally(this.allEntities);
    }
  }
});
</script>