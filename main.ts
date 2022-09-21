import { createApp } from "vue";
import App from "./src/App.vue";
import router from "./router";
import { BootstrapVue3, BToastPlugin } from "bootstrap-vue-3";
import VueSweetalert2 from "vue-sweetalert2";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTrash, faEye, faPen } from "@fortawesome/free-solid-svg-icons";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "sweetalert2/dist/sweetalert2.min.css";

library.add(faTrash, faEye, faPen);

createApp(App)
  .use(router)
  .use(BootstrapVue3)
  .use(BToastPlugin)
  .use(VueSweetalert2)
  .component("fa-icon", FontAwesomeIcon)
  .mount("#app");
