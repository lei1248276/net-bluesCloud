import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const Rage = () => import(/* webpackChunkName: "rage" */ '../views/rage/Rage.vue');
const SongList = () => import(/* webpackChunkName: "songList" */ '../views/songList/SongList.vue');
const Collect = () => import(/* webpackChunkName: "collect" */ '../views/collect/Collect.vue');
const Profile = () => import(/* webpackChunkName: "profile" */ '../views/profile/Profile.vue');
const Playlist = () => import(/* webpackChunkName: "playlist" */ '../views/playlist/Playlist.vue');
const PlayerPage = () => import(/* webpackChunkName: "playerPage" */ '../views/playerPage/PlayerPage.vue');


const routes = [
  {
    path: "",
    redirect: "/rage"
  },
  {
    path: "/rage",
    name: "rage",
    component: Rage
  },
  {
    path: "/songList",
    name: "songList",
    component: SongList
  },
  {
    path: "/collect",
    name: "collect",
    component: Collect
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile
  },
  {
    path: "/playlist/:id",
    name: "playlist",
    component: Playlist
  },
  {
    path: "/playerPage/:id",
    name: "playerPage",
    component: PlayerPage
  }
];

const Router = new VueRouter({
  routes,
  mode: 'history'
});

export default Router;