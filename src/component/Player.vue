<template>
    <div class="d-flex row">
        <div class="d-flex justify-content-between align-items-center mb-12">
            {{ timeFormat(curr) }}
            <b-progress :value="curr" :max="max" class="w-100 mx-2" style="height: 5px;" />
            {{ timeFormat(max) }}
        </div>
        <div class="d-flex justify-content-center">
            <b-button variant="link" @click="repeat()" :disabled="isEmpty() || isLoading">
                <fa-icon icon="fa-solid fa-repeat" :class="loop ? 'text-primary' : 'text-secondary'" size="xl" />
            </b-button>
            <b-button variant="link" @click="backward()" :disabled="isEmpty() || isLoading">
                <fa-icon icon="fa-solid fa-step-backward" class="text-primary" size="xl" />
            </b-button>
            <b-button variant="link" @click="play()" v-if="!isPlay" :disabled="isEmpty() || isLoading">
                <fa-icon icon="fa-solid fa-play-circle" class="text-primary" size="xl" />
            </b-button>
            <b-button variant="link" @click="pause()" v-if="isPlay" :disabled="isEmpty() || isLoading">
                <fa-icon icon="fa-solid fa-pause-circle" class="text-primary" size="xl" />
            </b-button>
            <b-button variant="link" @click="forward()" :disabled="isEmpty() || isLoading">
                <fa-icon icon="fa-solid fa-step-forward" class="text-primary" size="xl" />
            </b-button>
            <b-button variant="link" @click="stop()" :disabled="isEmpty() || isLoading">
                <fa-icon icon="fa-solid fa-stop-circle" class="text-primary" size="xl" />
            </b-button>
            <b-button variant="link" @click="muted()" :disabled="isEmpty() || isLoading">
                <fa-icon v-if="volume != 0" icon="fa-solid fa-volume-high" class="text-primary" size="xl" />
                <fa-icon v-else icon="fa-solid fa-volume-xmark" class="text-primary" size="xl" />
            </b-button>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, Ref, ref, watchEffect } from 'vue';
import { SongService } from '../service/songService';
import { Song } from '../entity/song';
import { File } from "../entity/file";
import Swal from 'sweetalert2';
import { swal } from '../entity/utils';
import { Response } from '../entity/response';

export default defineComponent({
    props: ['songs', 'autoplay'],
    expose: ['play', 'stop', 'backward', 'forward'],
    setup() {
        let curr: Ref<number | undefined> = ref(0);
        let max: Ref<number | undefined> = ref(0);
        return { curr, max };
    },
    data() {
        let song: Song | undefined;
        return { isPlay: false, isLoading: false, volume: 50, loop: true, song, songService: new SongService() };
    },
    unmounted() {
        if (this.song && this.song.file) {
            this.song.file.pause();
            this.song.file.currentTime = 0;
            this.isPlay = false;
        }
        this.song = undefined;
    },
    methods: {
        isEmpty() {
            return this.songs.length == 0;
        },
        play(_id?: any) {
            this.isLoading = true;
            let newSong: Song;
            if (this.song && this.song.file && !_id) {
                this.song.file.play();
                this.isPlay = true;
                this.isLoading = false;
            } else {
                this.pause();
                if (_id) {
                    newSong = this.songs?.find((s: Song) => s._id == _id);
                } else {
                    newSong = this.songs[0];
                }
                this.songService.findFile(newSong.file?._id).then(file => {
                    if (file.file) {
                        newSong.file = new File(file._id, file.file);
                        this.song = newSong;
                        if (this.song?.file) {
                            this.song.file.volume = this.volume * 0.01;
                            this.song.file.play();
                            this.song.file.ontimeupdate = this.ontimeupdate;
                            this.song.file.onended = this.onended;
                        }
                        this.isPlay = true;
                        this.isLoading = false;
                    } else {
                        Swal.fire(swal(new Response<any>(404, "El archivo está dañado")))
                    }
                });
            }
        },
        pause() {
            if (this.song && this.song.file) {
                this.song.file.pause();
                this.isPlay = false;
            }
        },
        stop() {
            if (this.song && this.song.file) {
                this.song.file.pause();
                this.song.file.currentTime = 0;
                this.isPlay = false;
            }
            this.song = undefined;
        },
        backward() {
            let song = this.songs[0];
            this.play(song._id);
        },
        forward() {
            let song = this.songs.pop();
            this.play(song._id);
        },
        formatter(number: number): string {
            return number.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        },
        timeFormat(time?: number) {
            let realtime = time ? Math.trunc(time) : 0;
            let min: number = Math.floor(realtime / 60 / 60);
            let second: number = Math.floor(realtime / 60);
            let mili: number = realtime % 60;
            return `${this.formatter(min)}:${this.formatter(second)}:${this.formatter(mili)}`;
        },
        ontimeupdate() {
            this.max = this.song?.file?.duration;
            this.curr = this.song?.file?.currentTime;
        },
        onended() {
            this.songs.pop();
            this.play();
        },
        muted() {
            this.volume = this.volume == 0 ? 50 : 0;
            if (this.song && this.song.file) {
                this.song.file.volume = this.volume * 0.01;
                this.isPlay = false;
            }
        },
        repeat() {
            this.loop = !this.loop;
        }
    }
});
</script>