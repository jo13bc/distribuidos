<template>
    <div class="d-flex justify-content-center">
        <b-button variant="link" @click="backward()" :disabled="isEmpty()">
            <fa-icon icon="fa-solid fa-step-backward" size="xl" />
        </b-button>
        <b-button variant="link" @click="play()" v-if="!isPlay" :disabled="isEmpty()">
            <fa-icon icon="fa-solid fa-play-circle" size="xl" />
        </b-button>
        <b-button variant="link" @click="stop()" v-else :disabled="isEmpty()">
            <fa-icon icon="fa-solid fa-stop-circle" size="xl" />
        </b-button>
        <b-button variant="link" @click="forward()" :disabled="isEmpty()">
            <fa-icon icon="fa-solid fa-step-forward" size="xl" />
        </b-button>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { ObjectId } from "mongodb";
import { Song } from '../entity/song';

export default defineComponent({
    props: ['songs'],
    expose: ['play', 'stop', 'backward', 'forward'],
    data() {
        return { isPlay: false };
    },
    methods: {
        isEmpty() {
            return this.songs.length == 0;
        },
        setState(_id: ObjectId, state: boolean = false) {
            for (let s of this.songs) {
                if (s._id == _id) {
                    s.isPlay = state;
                    this.isPlay = state;
                } else {
                    s.isPlay = false;
                }
            }
        },
        currentSong(): ObjectId {
            return this.songs.find((s: Song) => s.isPlay)._id;
        },
        play(_id?: ObjectId) {
            this.setState(_id ? _id : this.songs[0]._id, true);
        },
        stop(_id?: ObjectId) {
            this.setState(_id ? _id : this.currentSong(), false);
        },
        backward() {
            let song = this.songs[0];
            this.play(song._id);
        },
        forward() {
            let song = this.songs.pop();
            this.play(song._id);
        }
    }
});
</script>