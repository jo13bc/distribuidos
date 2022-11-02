import { createApp } from "vue";
import App from "./src/App.vue";
import router from "./router";
import { BootstrapVue3, BToastPlugin } from "bootstrap-vue-3";
import VueSweetalert2 from "vue-sweetalert2";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTrash, faEye, faPen, faArrowLeft, faStepBackward, faPlayCircle, faStopCircle, faStepForward } from "@fortawesome/free-solid-svg-icons";
import Vue3VideoPlayer from '@cloudgeek/vue3-video-player';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "sweetalert2/dist/sweetalert2.min.css";
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import '@cloudgeek/vue3-video-player/dist/vue3-video-player.css';

library.add(faTrash, faEye, faPen, faArrowLeft, faStepBackward, faPlayCircle, faStopCircle, faStepForward);

const app = createApp(App);

app.config.globalProperties.url = 'https://movie-mongo.netlify.app';

app.use(router)
  .use(BootstrapVue3)
  .use(BToastPlugin)
  .use(VueSweetalert2)
  .use(Vue3VideoPlayer)
  .component("fa-icon", FontAwesomeIcon)
  .mount("#app");
