<template>
    <main>
        <b-row class="mb-3">
            <b-col>
                <b-card header="Películas">
                        <router-link class="button button-primary" to="/movie">
                            {{ ENTITY.movie.title }}
                        </router-link>
                </b-card>
            </b-col>
            <b-col>
                <b-card header="Directores">
                        <router-link class="button button-primary" to="/director">
                            {{ ENTITY.director.title }}
                        </router-link>
                </b-card>
            </b-col>
            <b-col>
                <b-card header="Estudios">
                        <router-link class="button button-primary" to="/study">
                            {{ ENTITY.study.title }}
                        </router-link>
                </b-card>
            </b-col>
        </b-row>
    </main>
</template>
  
<script lang="ts">
import { ENTITY } from '../entity/utils';
import { defineComponent } from 'vue';
export default defineComponent({
    data() {
        return { ENTITY };
    }
});
</script>