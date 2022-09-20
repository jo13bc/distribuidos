<template>
  <b-modal id="entityModal" :title="title">
    <b-form-group label-for="image">
      <b-img center rounded="circle" v-bind="mainProps" v-bind:src="loadImage(entity.image)" />
      <b-form-input id="image" v-model="entity.image" trim hidden />
    </b-form-group>
    <b-form-group description="Ingresa tu nombre" label="Nombre:" label-for="name">
      <b-form-input id="name" v-model="entity.name" trim :disabled="!showSave" />
    </b-form-group>
    <b-form-group description="Selecciona el Director" label="Director:" label-for="director">
      <b-form-select v-model="entity.directorId" :options="directores" :disabled="!showSave"></b-form-select>
    </b-form-group>
    <b-form-group description="Selecciona los Estudios" label="Estudios:" label-for="stydies">
      <b-form-select v-model="entity.studies" :options="studies" multiple :select-size="1" :disabled="!showSave"></b-form-select>
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
import { Select } from '../../entity/select';
import { defineComponent, ref } from 'vue';
import { DirectorService } from '../../service/directorService';
import { StudyService } from '../../service/studyService';

export default defineComponent({
  props: ['title', 'entity', 'save', 'cancel', 'showSave'],
  data() {
    return {
      mainProps: { blank: false, width: 150, height: 150 },
      directores: Array<Select>(),
      studies: Array<Select>(),
      directorService: new DirectorService(),
      studyService: new StudyService()
    };
  },
  created() {
    this.listDirector();
    this.listStudy();
  },
  methods: {
    loadImage(url: string): string {
      return `/image/movie/` + url;
    },
    listDirector() {
      this.directorService.list()
        .then(result => this.directores = result.map(e => new Select(e.name, e.id)));
    },
    listStudy() {
      this.studyService.list()
        .then(result => this.studies = result.map(e => new Select(e.name, e.id)));
    }
  }
});
</script>