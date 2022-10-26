import { createRouter, createWebHistory } from "vue-router";
import Home from "./src/view/Home.vue";
import MovieIndex from "./src/view/movie/index.vue";
import MovieDetail from "./src/view/movie/detail.vue";
import StudyIndex from "./src/view/study/index.vue";
import StudyDetail from "./src/view/study/detail.vue";
import DirectorIndex from "./src/view/director/index.vue";
import DirectorDetail from "./src/view/director/detail.vue";
import { ENTITY } from "./src/entity/utils";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/movie",
    name: "Movie",
    component: MovieIndex,
    meta: { title: ENTITY.movie.title },
  },
  {
    path: "/movie/new",
    name: "Movie New",
    component: MovieDetail,
    props: { edit: true, title: ENTITY.movie.insert }
  },
  {
    path: "/movie/edit/:_id",
    name: "Movie Edit",
    component: MovieDetail,
    props: { edit: true, title: ENTITY.movie.update }
  },
  {
    path: "/movie/show/:_id",
    name: "Movie Detail",
    component: MovieDetail,
    props: { edit: false, title: ENTITY.movie.detail }
  },
  {
    path: "/study",
    name: "Study",
    component: StudyIndex,
    meta: { title: ENTITY.study.title },
  },
  {
    path: "/study/new",
    name: "Study New",
    component: StudyDetail,
    props: { edit: true, title: ENTITY.study.insert }
  },
  {
    path: "/study/edit/:_id",
    name: "Study Edit",
    component: StudyDetail,
    props: { edit: true, title: ENTITY.study.update }
  },
  {
    path: "/study/show/:_id",
    name: "Study Detail",
    component: StudyDetail,
    props: { edit: false, title: ENTITY.study.detail }
  },
  {
    path: "/director",
    name: "Director",
    component: DirectorIndex,
    meta: { title: ENTITY.director.title }
  },
  {
    path: "/director/new",
    name: "Director New",
    component: DirectorDetail,
    props: { edit: true, title: ENTITY.director.insert }
  },
  {
    path: "/director/edit/:_id",
    name: "Director Edit",
    component: DirectorDetail,
    props: { edit: true, title: ENTITY.director.update }
  },
  {
    path: "/director/show/:_id",
    name: "Director Detail",
    component: DirectorDetail,
    props: { edit: false, title: ENTITY.director.detail },
  },
];

export default createRouter({
  history: createWebHistory(),
  routes: routes,
});
