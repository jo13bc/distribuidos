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
import { defineComponent } from 'vue';
export default defineComponent({});
</script>