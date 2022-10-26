<template>
  <b-card :title="title">
    <b-form-group label-for="image">
      <b-img center rounded="circle" v-bind="detailImage" v-bind:src="loadImage(entity.image, ENTITY.study.name)" />
      <b-form-input id="image" v-model="entity.image" trim hidden />
    </b-form-group>
    <b-form-group description="Ingresa tu nombre" label="Nombre:" label-for="name">
      <b-form-input id="name" v-model="entity.name" trim :disabled="!edit" />
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
  import { StudyService } from '../../service/studyService';
  import { Movie } from '../../entity/movie';
  import { Study } from '../../entity/study';
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
        entity: new Study(),
        movieService: new MovieService(),
        studyService: new StudyService(),
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
      findMovies(ids: Array<number>): void {
        if (ids !== undefined) {
          this.studyService.listMovies(ids)
            .then(result => this.movies = result)
            .catch(err => Swal.fire(swal(err)));
        } else {
          this.movies = [];
        }
      },
      findDirector(id: number) {
        if (id === undefined) {
          this.entity = new Study();
          this.movies = [];
        } else {
          this.studyService.find(id)
            .then(result => {
              this.entity = result;
              this.findMovies(result.movies);
            })
          .catch(err => Swal.fire(swal(err)).then(r => this.cancelEntity()));
        }
      },
      cancelEntity() {
        this.$router.push('/study');
      },
      saveEntity(): void {
        if (this.entity.id === undefined) {
          this.studyService.insert(this.entity)
            .then(message => Swal.fire(swal(message)).then(r => this.cancelEntity()))
            .catch(err => Swal.fire(swal(err)));
        } else {
          this.studyService.update(this.entity)
            .then(message => Swal.fire(swal(message)).then(r => this.cancelEntity()))
            .catch(err => Swal.fire(swal(err)));
        }
      },
    }
  });
  </script>