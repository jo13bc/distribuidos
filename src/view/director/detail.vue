<template>
  <b-card :title="title">
    <b-form-group label-for="image">
      <b-img center rounded="circle" v-bind="detailImage" v-bind:src="loadImage(entity.image, ENTITY.director.name)" />
      <b-form-input id="image" v-model="entity.image" trim hidden />
    </b-form-group>
    <b-form-group description="Ingresa tu nombre" label="Nombre:" label-for="name">
      <b-form-input id="name" v-model="entity.name" trim :disabled="!edit" />
    </b-form-group>
    <b-form-group description="Ingresa tu fecha de nacimiento" label="Fecha nacimiento:" label-for="birth_year">
      <b-form-input id="birth_year" v-model="entity.birth_year" trim :disabled="!edit" />
    </b-form-group>
    <b-form-group description="Ingresa tu nacionalidad" label="Nacionalidad:" label-for="nationality">
      <b-form-input id="nationality" v-model="entity.nationality" trim :disabled="!edit" />
    </b-form-group>
    <b-form-group label-for="table" v-if="entity.id !== undefined">
      <b-table id="table" :items="movies" :fields="TABLE_HEADER_MOVIE" responsive>
        <template #cell(image)="data">
          <b-img rounded="circle" v-bind="tableImage" v-bind:src="loadImage(data.value, ENTITY.movie.name)" />
        </template>
        <template #cell(nameid)="data">
          <router-link class="button button-primary" :to="'/movie/show/' + data.item.id">
            {{data.item.name}}
          </router-link>
        </template>
      </b-table>
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
import { defineComponent } from 'vue';
import { Filter } from '../../entity/filter';
import { MovieService } from '../../service/movieService';
import { DirectorService } from '../../service/directorService';
import { Movie } from '../../entity/movie';
import { Director } from '../../entity/director';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { ENTITY, swal, detailImage, tableImage, loadImage } from '../../entity/utils';

const TABLE_HEADER_MOVIE = [
  new Filter("image", ""),
  new Filter("nameid", "Películas")
];

export default defineComponent({
  props: ['edit', 'title'],
  data() {
    return {
      detailImage,
      entity: new Director(),
      movieService: new MovieService(),
      directorService: new DirectorService(),
      ENTITY,
      tableImage,
      TABLE_HEADER_MOVIE,
      movies: new Array<Movie>(),
    };
  },
  created() {
    const params: any = useRoute().params;
    this.findDirector(params.id);
  },
  methods: {
    loadImage: (n: string, e: string) => loadImage(n, e, useRoute()),
    findMovies(id: number): void {
      if (id !== undefined) {
        this.directorService.listMovies(id)
          .then(result => this.movies = result)
          .catch(err => Swal.fire(swal(err)));
      } else {
        this.movies = [];
      }
    },
    findDirector(id: number) {
      if (id === undefined) {
        this.entity = new Director();
        this.movies = [];
      } else {
        this.directorService.find(id)
          .then(result => {
            this.entity = result;
            this.findMovies(id);
          }).catch(err => Swal.fire(swal(err)).then(r => this.cancelEntity()));
      }
    },
    cancelEntity() {
      this.$router.push('/director');
    },
    saveEntity(): void {
      if (this.entity.id === undefined) {
        this.directorService.insert(this.entity)
          .then(message => Swal.fire(swal(message)).then(r => this.cancelEntity()))
          .catch(err => Swal.fire(swal(err)));
      } else {
        this.directorService.update(this.entity)
          .then(message => Swal.fire(swal(message)).then(r => this.cancelEntity()))
          .catch(err => Swal.fire(swal(err)));
      }
    },
  }
});
</script>