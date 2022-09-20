<template>
    <header>
        <b-navbar toggleable="lg" type="dark" variant="light">
            <b-navbar-brand href="/">Inicio</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item href="/movie">Películas</b-nav-item>
                    <b-nav-item href="/study">Estudios</b-nav-item>
                    <b-nav-item href="/director">Directores</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </header>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({});
</script>