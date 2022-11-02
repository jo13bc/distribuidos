<template>
  <main>
    <b-container id="container" :toast="{ root: true }" class="mt-5 mb-5" fluid="sm">
      <h3>Listas de reproducción</h3>
      <b-row class="mt-3">
        <b-col sm="3" class="mb-3" v-for="entity of entities" v-bind:key="entity._id">
          <b-link @click="loadEntity(ACTION.update, entity._id)">
            <b-card no-body overlay tag="article">
              <b-card-img v-bind="tableImage" v-bind:src="loadImage(entity.image)" alt="Image" class="rounded-0">
              </b-card-img>
              <b-card-body :title="entity.name" style="background-color: rgba(255, 255, 255, 0.3)"></b-card-body>
            </b-card>
          </b-link>
        </b-col>
      </b-row>
      <b-button variant="primary" @click="loadEntity(ACTION.insert)">Nueva</b-button>
    </b-container>
  </main>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useLoading } from 'vue3-loading-overlay';
import { Filter } from '../../entity/filter';
import { Playlist } from '../../entity/playlist';
import { Response } from '../../entity/response';
import { PlaylistService } from '../../service/playlistService';
import Swal from 'sweetalert2';
import { ACTION, swal, tableImage, loadImage, loadEntity } from '../../entity/utils';
import { useRoute } from 'vue-router';
import { ObjectId } from 'mongodb';

const TABLE_HEADER = [
  new Filter("image", "Fotografía"),
  new Filter("name_id", "Nombre"),
  new Filter("_id", "Acciones")
];

export default defineComponent({
  props: ['show'],
  setup() {
    return { loader: useLoading() };
  },
  data() {
    return {
      table_header: TABLE_HEADER,
      entities: new Array<Playlist>(),
      service: new PlaylistService(),
      ACTION,
      tableImage
    };
  },
  created() {
    this.allEntities();
  },
  methods: {
    loadImage: (n: string) => loadImage(n, 'playlist', useRoute()),
    loadEntity(a: string, i: ObjectId | undefined = undefined) {
      this.$router.push(`/playlist/${i ? i : '-1'}`)
    },
    allEntities(): void {
      this.loader.show();
      this.service.list()
        .then(result => this.entities = result)
        .catch(err => Swal.fire(swal(err)))
        .finally(this.loader.hide);
    },
    deleteEntity(_id: ObjectId): void {
      let swalAux = swal(new Response<any>(0, "¿Está seguro que desea eliminar la lista de reproducción?"));
      Swal.fire(swalAux).then((result) => {
        if (result.isConfirmed) {
          this.service.delete(_id)
            .then(message => Swal.fire(swal(message)))
            .catch(err => Swal.fire(swal(err)))
            .finally(this.allEntities);
        }
      });
    }
  }
});
</script>