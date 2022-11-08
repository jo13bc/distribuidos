<template>
    <main>
        <b-row>
            <b-col sm="3">
                <b-card no-body overlay tag="article">
                    <b-card-img v-bind="tableImage" v-bind:src="loadImage(playlist.image, 'playlist')"
                        class="rounded-0">
                    </b-card-img>
                    <b-card-body style="background-color: rgba(255, 255, 255, 0.3)">
                        <div class="d-flex justify-content-between">
                            <b-card-title>
                                <b-form-input id="name" v-model="playlist.name" trim v-if="edit || !playlist._id" />
                                <label @click="editPlaylist()" v-if="!edit && playlist._id">{{ playlist.name }}</label>
                            </b-card-title>
                            <div class="d-flex justify-content-end">
                                <b-button variant="link" @click="deletePlaylist()" v-if="!edit && playlist._id">
                                    <fa-icon icon="fa-solid fa-trash" size="xl" />
                                </b-button>
                                <b-button variant="link" @click="save()" v-if="edit || !playlist._id">
                                    <fa-icon icon="fa-solid fa-floppy-disk" size="xl" />
                                </b-button>
                                <b-button variant="link" @click="cancel()" v-if="edit || !playlist._id">
                                    <fa-icon icon="fa-solid fa-ban" size="xl" />
                                </b-button>
                            </div>
                        </div>
                        <Player v-bind:files="getFiles()" ref="player" />
                    </b-card-body>
                </b-card>
                <router-link to="/playlist">
                    <fa-icon icon="fa-solid fa-arrow-left" class="mt-3" size="xl" />
                </router-link>
            </b-col>
            <b-col>
                <b-list-group class="mb-3">
                    <b-list-group-item v-for="song of entities">
                        <div class="d-flex justify-content-between">
                            <div class="d-flex justify-content-start w-100">
                                <b-button variant="link" @click="player?.play(song._id)">
                                    <fa-icon icon="fa-solid fa-play-circle" size="xl" />
                                </b-button>
                                <router-link class="d-flex flex-column w-100"
                                    :to="'/song/' + playlist._id + '/' + song._id">
                                    <h4>{{ song.name }}</h4>
                                    <label>{{ song.author }}</label>
                                </router-link>
                            </div>
                            <div class="d-flex justify-content-end">
                                <b-button variant="link" @click="deleteSong(song._id)">
                                    <fa-icon icon="fa-solid fa-trash" size="xl" />
                                </b-button>
                            </div>
                        </div>
                    </b-list-group-item>
                    <b-list-group-item v-if="entities.length == 0" class="d-flex justify-content-center bg-light">
                        <label>Aún no has agregado canciones a esta lista</label>
                    </b-list-group-item>
                </b-list-group>
                <b-button variant="primary" @click="loadEntity(ACTION.insert)" v-if="playlist._id">Nueva</b-button>
            </b-col>
        </b-row>
    </main>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useLoading } from 'vue3-loading-overlay';
import Player from '../../component/Player.vue';
import { PlaylistService } from '../../service/playlistService';
import { SongService } from '../../service/songService';
import { RabbitService } from '../../service/rabbitService';
import { Song } from '../../entity/song';
import { File } from '../../entity/file';
import Swal from 'sweetalert2'
import { swal, ACTION, detailImage, tableImage, loadImage, loadEntity } from '../../entity/utils';
import { Filter } from '../../entity/filter';
import { Playlist } from '../../entity/playlist';
import { Response } from '../../entity/response';

const TABLE_HEADER_SONG = [
    new Filter("authorname_id", ""),
    new Filter("_id", "")
];

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
            playlist: new Playlist(),
            detailImage,
            playlistService: new PlaylistService(),
            songService: new SongService(),
            TABLE_HEADER_SONG,
            entities: new Array<Song>(),
            tableImage,
            ACTION,
            edit: false,
            play_: false
        };
    },
    created() {
        const params: any = useRoute().params;
        this.findPlaylist(params._id);
    },
    methods: {
        loadImage: (n: string, e: string) => loadImage(n, e, useRoute()),
        loadEntity(a: string, i: any | undefined = undefined) {
            this.$router.push(`/song/${this.playlist._id}/${i ? i : '-1'}`)
        },
        findPlaylist(_id: any) {
            if (_id == undefined || _id == -1) {
                this.playlist = new Playlist();
            } else {
                this.loader.show();
                this.findSongs(_id);
                this.playlistService.find(_id)
                    .then(result => this.playlist = result)
                    .catch(err => Swal.fire(swal(err)).then(r => this.cancelEntity()))
                    .finally(this.loader.hide);
            }
        },
        findSongs(_id: any) {
            if (_id === undefined) {
                this.entities = [];
            } else {
                this.playlistService.listSong(_id)
                    .then(result => {
                        this.entities = result.map((e: Song) => Song.clone(e));
                    })
                    .catch(err => Swal.fire(swal(err)).then(r => this.cancelEntity()));
            }
        },
        cancelEntity() {
            this.$router.push('/playlist');
        },
        save() {
            if (this.playlist._id === undefined) {
                this.playlistService.insert(this.playlist)
                    .then(message => {
                        this.playlist._id = message.body.insertedId;
                        Swal.fire(swal(message));
                    })
                    .catch(err => Swal.fire(swal(err)));
            } else {
                this.playlistService.update(this.playlist)
                    .then(message => Swal.fire(swal(message)))
                    .catch(err => Swal.fire(swal(err)));
            }
            this.edit = false;
        },
        cancel() {
            this.edit = false;
        },
        editPlaylist() {
            this.edit = true;
        },
        deletePlaylist() {
            let swalAux = swal(new Response<any>(0, "¿Está seguro que desea eliminar la lista de reproducción?"));
            Swal.fire(swalAux).then((result) => {
                if (result.isConfirmed) {
                    this.playlistService.delete(this.playlist._id)
                        .then(message => Swal.fire(swal(message)))
                        .catch(err => Swal.fire(swal(err)))
                        .finally(this.cancelEntity);
                }
            });
        },
        deleteSong(_id?: any) {
            let swalAux = swal(new Response<any>(0, "¿Está seguro que desea eliminar la canción?"));
            Swal.fire(swalAux).then((result) => {
                if (result.isConfirmed) {
                    let playList_Id = this.playlist._id;
                    this.songService.delete(_id)
                        .then(message => Swal.fire(swal(message)))
                        .catch(err => Swal.fire(swal(err)))
                        .finally(() => this.findSongs(playList_Id));
                }
            });
        },
        getFiles(){
            return this.entities ? this.entities.map(s => new File(s._id)) : [];
        }
    }
});
</script>