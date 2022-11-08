<template>
    <header>
        <b-navbar toggleable="lg" type="dark" variant="light">
            <b-navbar-brand href="/">Inicio</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item>
                        <router-link class="button button-primary" to="/playlist">
                            Lista de reproducción
                        </router-link>
                    </b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </header>
</template>
  
<script lang="ts">
import { RabbitService } from '../service/rabbitService';
import { defineComponent } from 'vue';
export default defineComponent({
    setup() {
        let taskId: number | undefined;
        return { rabbitService: new RabbitService(), taskId };
    },
    mounted() {
        this.taskId = setInterval(this.task, 100000);
    },
    unmounted() {
        clearInterval(this.taskId);
    },
    methods: {
        task() {
            this.rabbitService.runtask();
        }
    }
});
</script>