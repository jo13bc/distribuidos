<template>
    <header>
        <b-navbar toggleable="lg" type="dark" variant="light">
            <b-navbar-brand>
                <router-link class="btn btn-link" to="/">
                    Inicio
                </router-link>
            </b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item>
                        <router-link class="btn btn-link" to="/movie">
                            Películas
                        </router-link>
                    </b-nav-item>
                    <b-nav-item>
                        <router-link class="btn btn-link" to="/director">
                            Directores
                        </router-link>
                    </b-nav-item>
                    <b-nav-item>
                        <router-link class="btn btn-link" to="/study">
                            Estudios
                        </router-link>
                    </b-nav-item>
                    <b-nav-item>
                        <b-button variant="link" @click="loggout()">
                            Cerrar sesión
                        </b-button>
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
            this.$router.push('/');
            location.reload();
        }
    }
});
</script>