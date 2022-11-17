<template>
    <header>
        <b-navbar toggleable="lg" type="dark" variant="light">
            <b-navbar-brand href="/home">Inicio</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item>
                        <router-link class="button button-primary" to="/movie">
                            Películas
                        </router-link>
                    </b-nav-item>
                    <b-nav-item>
                        <router-link class="button button-primary" to="/director">
                            Directores
                        </router-link>
                    </b-nav-item>
                    <b-nav-item>
                        <router-link class="button button-primary" to="/study">
                            Estudios
                        </router-link>
                    </b-nav-item>
                    <b-nav-item>
                        <router-link class="button button-primary" @click="loggout()">
                            Cerrar sesión
                        </router-link>
                    </b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </header>
</template>
  
<script lang="ts">
import { ENTITY } from '../entity/utils';
import { defineComponent } from 'vue';
export default defineComponent({
    data() {
        return { ENTITY };
    },
    methods: {
        loggout() {
            sessionStorage.removeItem('user');
        }
    }
});
</script>