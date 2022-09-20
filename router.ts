import { createRouter, createWebHistory } from "vue-router";
import Home from "./src/view/Home.vue";
import MovieIndex from "./src/view/movie/index.vue";
import StudyIndex from "./src/view/study/index.vue";
import DirectorIndex from "./src/view/director/index.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/movie", name: "Movie", component: MovieIndex },
  { path: "/study", name: "Study", component: StudyIndex },
  { path: "/director", name: "Director", component: DirectorIndex },
];

export default createRouter({
  history: createWebHistory(),
  routes: routes,
});
