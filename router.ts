import { createRouter, createWebHistory } from "vue-router";
import Home from "./src/view/Home.vue";
import PlaylistIndex from "./src/view/playlist/index.vue";
import PlaylistDetail from "./src/view/playlist/detail.vue";
import Song from "./src/view/song/detail.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/playlist",
    name: "playlist",
    component: PlaylistIndex,
  },
  {
    path: "/playlist/:_id",
    name: "playlist-detail",
    component: PlaylistDetail,
  },
  {
    path: "/song/:playlist/:_id",
    name: "song",
    component: Song
  },
];

export default createRouter({
  history: createWebHistory(),
  routes: routes,
});
