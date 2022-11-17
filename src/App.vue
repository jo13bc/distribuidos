<template>
    <main class="h-100">
        <div v-if="isLoggued">
            <Header />
            <b-container id="container" :toast="{ root: true }" class="mt-5 mb-5" fluid="sm">
                <router-view />
            </b-container>
            <Footer />
        </div>
        <div v-else class="h-100">
            <b-container id="container" :toast="{ root: true }" class="d-flex justify-content-center mt-5 mb-5" fluid="sm">
                <Auth title="Login" />
            </b-container>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './component/Header.vue';
import Footer from './component/Footer.vue';
import Auth from './component/Auth.vue';

export default defineComponent({
    components: {
        Header,
        Footer,
        Auth
    },
    data() {
        return { isLoggued: false };
    }
});
</script>