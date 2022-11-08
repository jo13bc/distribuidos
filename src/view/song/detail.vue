<template>
  <b-container id="container" :toast="{ root: true }" class="mt-5 mb-5" fluid="sm">
    <b-card no-body class="overflow-hidden">
      <b-row no-gutters>
        <b-col md="6">
          <b-card-body>
            <b-form-group description="Nombre de la canción" label="Nombre:" label-for="name">
              <b-form-input id="name" v-model="entity.name" trim :disabled="!edit" />
            </b-form-group>
            <b-form-group description="Nombre del Author" label="Author:" label-for="author">
              <b-form-input id="author" v-model="entity.author" trim :disabled="!edit" />
            </b-form-group>
            <b-form-group description="Nombre del Álbum" label="Álbum:" label-for="album">
              <b-form-input id="album" v-model="entity.album" trim :disabled="!edit" />
            </b-form-group>
            <b-form-group description="Dirección url del recurso" label="URL:" label-for="url">
              <b-form-input id="url" v-model="entity.url" trim :disabled="!edit" />
            </b-form-group>
          </b-card-body>
        </b-col>
        <b-col md="6">
          <b-card-body>
            <b-form-group label="-">
              <b-card-img v-bind="detailImage" v-bind:src="loadImage(entity.image)" class="rounded-0 mb-1" />
            </b-form-group>
            <!--<b-form-group label-for="image">
              <input class="form-control" type="file" @change="setFile" />
            </b-form-group>
            <b-form-file v-model="entity.image" :state="Boolean(entity.image)" placeholder="Seleccione la imagen"
              drop-placeholder="Imagen"></b-form-file>-->
            <b-form-input id="image" v-model="entity.image" trim hidden />
            <b-form-group label-for="file">
              <Player v-bind:files="getFile()" ref="player" />
            </b-form-group>
          </b-card-body>
        </b-col>
      </b-row>
      <template #footer>
        <b-container fluid v-if="edit">
          <b-row>
            <b-col class="text-end">
              <b-button variant="secondary" @click="cancelEntity">Cancelar</b-button>
            </b-col>
            <b-col class="text-left">
              <b-button variant="primary" @click="saveEntity">Guardar</b-button>
            </b-col>
            <b-col>
              <b-button variant="success" @click="subir()">Subir</b-button>
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
  </b-container>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useLoading } from 'vue3-loading-overlay';
import Player from '../../component/Player.vue';
import { SongService } from '../../service/songService';
import { Song } from '../../entity/song';
import { File } from '../../entity/file';
import Swal from 'sweetalert2'
import { swal, detailImage, loadImage } from '../../entity/utils';
import { RabbitService } from '../../service/rabbitService';

export default defineComponent({
  components: {
    Player
  },
  setup() {
    const player = ref<InstanceType<typeof Player> | null>(null).value;
    return { loader: useLoading(), player, rabbitService: new RabbitService() };
  },
  data() {
    return {
      detailImage,
      entity: new Song(),
      songService: new SongService(),
      edit: true,
      rabbitService: new RabbitService()
    };
  },
  created() {
    const params: any = useRoute().params;
    this.findSong(params.playlist, params._id);
  },
  methods: {
    loadImage: (n: string) => loadImage(n, 'song', useRoute()),
    findSong(playlist: any, _id: any) {
      if (_id === undefined || _id == -1) {
        this.entity = new Song();
        this.entity.playlist = playlist;
      } else {
        this.loader.show();
        this.songService.find(_id)
          .then(result => {
            this.entity = Song.clone(result);
            this.loader.hide();
          })
          .catch(err => Swal.fire(swal(err)).then(r => this.cancelEntity()));
      }
    },
    cancelEntity() {
      this.$router.push(`/playlist/${this.entity.playlist}`);
    },
    saveEntity(): void {
      this.loader.show();
      if (this.entity._id == undefined) {
        this.songService.insert(this.entity)
          .then(message => Swal.fire(swal(message)).then(this.cancelEntity))
          .catch(err => Swal.fire(swal(err)))
          .finally(this.loader.hide);
      } else {
        this.songService.update(this.entity)
          .then(message => Swal.fire(swal(message)).then(this.cancelEntity))
          .catch(err => Swal.fire(swal(err)))
          .finally(this.loader.hide);
      }
    },
    /*
    setFile(event: any) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadstart = () => {
        this.loader.show();
      }
      reader.onload = () => {
        this.file = new File(this.entity?._id, reader.result as string);
        console.log(reader.result);
      };
      reader.onerror = function (err) {
        Swal.fire(swal(new Response<any>(400, JSON.stringify(err))));
      };
      reader.onloadend = () => {
        this.loader.hide();
        //Swal.fire(swal(new Response<any>(200, 'Archivo cargado con éxito')));
      }
    },*/
    getFile() {
      return [new File(this.entity._id)];
    },
    subir() {
      this.rabbitService.runtask()
        .then(message => Swal.fire(swal(message))/*.then(this.cancelEntity)*/)
        .catch(err => Swal.fire(swal(err)));
    }
  }
});
</script>