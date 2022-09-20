<template>
  <b-modal id="entityModal" :title="title">
    <b-form-group label-for="image">
      <b-img center rounded="circle" v-bind="mainProps" v-bind:src="loadImage(entity.image)" />
      <b-form-input id="image" v-model="entity.image" trim hidden />
    </b-form-group>
    <b-form-group description="Ingresa tu nombre" label="Nombre:" label-for="name">
      <b-form-input id="name" v-model="entity.name" trim />
    </b-form-group>
    <b-form-group label-for="table">
      <b-table id="table" :items="movies" :fields="table_header" responsive>
        <template #cell(image)="data">
          <b-img rounded="circle" v-bind="mainPropsMovie" v-bind:src="loadImage(data.value, false)" />
        </template>
        <template #cell(nameid)="data">
          <b-link>
            {{data.item.name}}
          </b-link>
        </template>
      </b-table>
    </b-form-group>
    <template #footer>
      <b-container fluid v-if="showSave">
        <b-row>
          <b-col class="text-end">
            <b-button ref="btnCancel" v-b-modal.entityModal @click="cancel" variant="secondary">Cancelar</b-button>
          </b-col>
          <b-col class="text-left">
            <b-button ref="btnSave" v-b-modal.entityModal @click="save" variant="primary">Guardar</b-button>
          </b-col>
        </b-row>
      </b-container>
      <b-container fluid v-else>
        <b-row>
          <b-col class="text-center">
            <b-button ref="btnCancel" v-b-modal.entityModal @click="cancel" variant="secondary">Cancelar</b-button>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </b-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Movie } from '../../entity/movie';
import { StudyService } from '../../service/studyService';
import { Filter } from '../../entity/filter';
const TABLE_HEADER = [
  new Filter("image", ""),
  new Filter("nameid", "Películas")
];

export default defineComponent({
  props: ['title', 'entity', 'save', 'cancel', 'showSave'],
  data() {
    return {
      mainProps: { blank: false, width: 150, height: 150 },
      mainPropsMovie: { blank: false, width: 45, height: 45 },
      table_header: TABLE_HEADER,
      movies: Array<Movie>(),
      studyService: new StudyService()
    };
  },
  updated() {
    this.listMovie();
  },
  methods: {
    loadImage(url: string, study: boolean = true): string {
      return `/image/${study ? 'study' : 'movie'}/` + url;
    },
    listMovie() {
      if (this.entity.id !== null && this.entity.id !== undefined) {
        this.studyService.listMovies(this.entity.id)
          .then(result => this.movies = result);
      } else {
        this.movies = [];
      }
    }
  }
});
</script>