<template>
    <main>
        <Header />
        <b-container id="container" ref="container" :toast="{root: true}" class="mt-3" fluid="sm">
            <router-view />
        </b-container>
        <Footer />
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './component/Header.vue';
import Footer from './component/Footer.vue';

export default defineComponent({
    components: {
        Header,
        Footer
    }
});
</script>