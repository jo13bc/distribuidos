<template>
  <b-card :title="$route.meta.title">
    <b-form-group label-for="image">
      <b-img center rounded="circle" v-bind="detailImage" v-bind:src="loadImage(entity.image, ENTITY.movie.name)" />
      <b-form-input id="image" v-model="entity.image" trim hidden />
    </b-form-group>
    <b-form-group description="Ingresa tu nombre" label="Nombre:" label-for="name">
      <b-form-input id="name" v-model="entity.name" trim :disabled="!edit" />
    </b-form-group>
    <b-form-group description="Selecciona el Director" label="Director:" label-for="director" v-if="edit">
      <b-form-select v-model="entity.directorId" :options="directoresSelect"></b-form-select>
    </b-form-group>
    <b-form-group description="Selecciona los Estudios" label="Estudios:" label-for="stydies" v-if="edit">
      <b-form-select v-model="entity.studies" :options="studiesSelect" multiple :select-size="4" :disabled="!edit">
      </b-form-select>
    </b-form-group>
    <b-form-group v-if="!edit">
      <b-row>
        <b-col>
          <b-table :items="directores" :fields="TABLE_HEADER_DIRECTOR" responsive>
            <template #cell(image)="data">
              <b-img rounded="circle" v-bind="tableImage" v-bind:src="loadImage(data.value, ENTITY.director.name)" />
            </template>
            <template #cell(nameid)="data">
              <router-link class="button button-primary" :to="'/director/show/' + data.item.id">
                {{ data.item.name }}
              </router-link>
            </template>
          </b-table>
        </b-col>
        <b-col>
          <b-table :items="studies" :fields="TABLE_HEADER_STUDY" responsive>
            <template #cell(image)="data">
              <b-img rounded="circle" v-bind="tableImage" v-bind:src="loadImage(data.value, ENTITY.study.name)" />
            </template>
            <template #cell(nameid)="data">
              <router-link class="button button-primary" :to="'/study/show/' + data.item.id">
                {{ data.item.name }}
              </router-link>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-form-group>
    <template #footer>
      <b-container fluid v-if="edit">
        <b-row>
          <b-col class="text-end">
            <b-button variant="secondary" @click="cancelEntity">Cancelar</b-button>
          </b-col>
          <b-col class="text-left">
            <b-button variant="primary" @click="saveEntity">Guardar</b-button>
          </b-col>
        </b-row>
      </b-container>
      <b-container fluid v-else>
        <b-row>
          <b-col class="text-center">
            <b-button variant="secondary" @click="cancelEntity">Cancelar</b-button>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </b-card>
</template>
<script lang="ts">
import { Select } from '../../entity/select';
import { defineComponent } from 'vue';
import { Filter } from '../../entity/filter';
import { MovieService } from '../../service/movieService';
import { DirectorService } from '../../service/directorService';
import { StudyService } from '../../service/studyService';
import { Movie } from '../../entity/movie';
import { Director } from '../../entity/director';
import { Study } from '../../entity/study';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { ACTION, ENTITY, swal, detailImage, tableImage, loadImage } from '../../entity/utils';

const TABLE_HEADER_DIRECTOR = [
  new Filter("image", ""),
  new Filter("nameid", "Director")
];

const TABLE_HEADER_STUDY = [
  new Filter("image", ""),
  new Filter("nameid", "Estudios")
];

export default defineComponent({
  props: ['edit'],
  data() {
    return {
      detailImage,
      entity: new Movie(),
      directoresSelect: Array<Select>(),
      studiesSelect: Array<Select>(),
      movieService: new MovieService(),
      directorService: new DirectorService(),
      studyService: new StudyService(),
      ENTITY,
      tableImage,
      TABLE_HEADER_DIRECTOR,
      TABLE_HEADER_STUDY,
      directores: new Array<Director>(),
      studies: new Array<Study>()
    };
  },
  created() {
    const params: any = useRoute().params;
    this.findMovie(params.id);
    this.listDirector();
    this.listStudy();
  },
  methods: {
    loadImage: (n: string, e: string) => loadImage(n, e, useRoute()),
    listDirector() {
      this.directorService.list()
        .then(result => this.directoresSelect = result.map(e => new Select(e.name, e.id)))
        .catch(err => Swal.fire(swal(err)));
    },
    listStudy() {
      this.studyService.list()
        .then(result => this.studiesSelect = result.map(e => new Select(e.name, e.id)))
        .catch(err => Swal.fire(swal(err)));
    },
    findDirector(id: number | undefined): void {
      if (id !== undefined) {
        this.directorService.find(id)
          .then(result => this.directores = [result])
          .catch(err => Swal.fire(swal(err)));
      } else {
        this.directores = [];
      }
    },
    findStudies(id: number): void {
      if (id !== undefined) {
        this.movieService.listStydies(id)
          .then(result => this.studies = result)
          .catch(err => Swal.fire(swal(err)));
      } else {
        this.studies = [];
      }
    },
    findMovie(id: number) {
      if (id === undefined) {
        this.entity = new Movie();
      } else {
        this.movieService.find(id)
          .then(result => {
            this.entity = result;
            if (!this.edit) {
              this.findDirector(result.directorId);
              this.findStudies(id);
            }
          })
          .catch(err => Swal.fire(swal(err)).then(r => this.cancelEntity()));
      }
    },
    cancelEntity() {
      this.$router.push('/movie');
    },
    saveEntity(): void {
      if (this.entity.id == undefined) {
        this.movieService.insert(this.entity)
          .then(message => Swal.fire(swal(message)).then(r => this.cancelEntity()))
          .catch(err => Swal.fire(swal(err)));
      } else {
        this.movieService.update(this.entity)
          .then(message => Swal.fire(swal(message)).then(r => this.cancelEntity()))
          .catch(err => Swal.fire(swal(err)));
      }
    },
  }
});
</script>