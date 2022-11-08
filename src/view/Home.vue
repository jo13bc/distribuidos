<template>
    <main>
        <b-row>
            <b-col>
                <b-card header="Mi biblioteca">
                        <router-link class="button button-primary" to="/playlist">
                            Listas de reproducción
                        </router-link>
                </b-card>
            </b-col>
        </b-row>
    </main>
</template>
  
<script lang="ts">
//import { RabbitService } from '../service/rabbitService';
import { defineComponent } from 'vue';
export default defineComponent({
    /*setup() {
        let taskId: number | undefined;
        return { rabbitService: new RabbitService(), taskId };
    },
    mounted() {
        this.taskId = setInterval(this.task, 9000);
    },
    unmounted() {
        clearInterval(this.taskId);
    },
    methods: {
        task() {
            this.rabbitService.runtask();
        }
    }*/
});
</script>