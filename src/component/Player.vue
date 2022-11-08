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
import { defineComponent, Ref, ref } from 'vue';
import { SongService } from '../service/songService';
import { Response } from '../entity/response';
import { File } from "../entity/file";
import Swal from 'sweetalert2';
import { swal } from '../entity/utils';

export default defineComponent({
    props: ['files', 'autoplay'],
    expose: ['play', 'stop', 'backward', 'forward'],
    setup() {
        let curr: Ref<number | undefined> = ref(0);
        let max: Ref<number | undefined> = ref(0);
        return { curr, max, filesPlayed: new Array<File>(), songService: new SongService() };
    },
    data() {
        let file: File | undefined;
        return { isPlay: false, isLoading: false, volume: 100, loop: true, file };
    },
    unmounted() {
        if (this.file) {
            this.file.pause();
            this.file.currentTime = 0;
            this.isPlay = false;
        }
        this.file = undefined;
    },
    methods: {
        isEmpty() {
            return this.files ? this.files.length == 0 : true;
        },
        async play(_id?: any) {
            this.isLoading = true;
            let newFile: File | undefined;
            if (this.file && !_id) {
                this.file.play();
                this.isPlay = true;
                this.isLoading = false;
            } else {
                this.pause();
                if (_id) {
                    newFile = this.files?.find((s: File) => s._id == _id);
                } else {
                    newFile = this.files[0];
                }
                if (newFile) {
                    try {
                        if (!this.file?.src) {
                            newFile = await this.songService.findFile(newFile._id);
                            if (!newFile.src) {
                                throw "El archivo recuperado de la base de datos está dañado";
                            }
                        }
                        if (newFile.src) {
                            this.file = File.Clone(newFile);
                            this.file.volume = this.volume * 0.01;
                            this.file.play();
                            this.file.ontimeupdate = this.ontimeupdate;
                            this.file.onended = this.onended;
                            this.isPlay = true;
                            this.isLoading = false;
                        } else {
                            throw "El archivo cargado está dañado";
                        }
                    } catch (error) {
                        Swal.fire(swal(new Response<any>(404, error as string)));
                    }
                }
            }
        },
        pause() {
            if (this.file) {
                this.file.pause();
                this.isPlay = false;
            }
        },
        stop() {
            if (this.file) {
                this.file.pause();
                this.file.currentTime = 0;
                this.isPlay = false;
            }
            this.file = undefined;
        },
        backward() {
            this.stop();
            let file = this.filesPlayed.pop() as File;
            this.files.unshift(file);
            this.play();
        },
        forward() {
            this.stop();
            let file = this.files.shift() as File;
            this.filesPlayed.push(file);
            this.play();
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
            this.max = this?.file?.duration;
            this.curr = this?.file?.currentTime;
        },
        onended() {
            this.files.pop();
            this.play();
        },
        muted() {
            this.volume = this.volume == 0 ? 50 : 0;
            if (this.file) {
                this.file.volume = this.volume * 0.01;
            }
        },
        repeat() {
            this.loop = !this.loop;
        }
    }
});
</script>