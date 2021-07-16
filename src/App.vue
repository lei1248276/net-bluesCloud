<template>
  <div id="app">
    <nav-bar></nav-bar>
    <tab-control :title="['时下流行', '歌单', '个人收藏', '我的']"
                 @tabClick="onTabClick" ref="tabControl"></tab-control>
    <keep-alive exclude="Playlist">
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import NavBar from "@/components/common/navBar/NavBar";
import TabControl from "@/components/content/tab-control/TabControl";
import Player from "@/components/content/player/Player";

import types from "@/store/mutation-types";
import {mapGetters, mapMutations} from 'vuex';

export default {
  name: "app",
  components: {
    NavBar,
    TabControl,
    Player
  },
  data() {
    return {
      routes: ['rage', 'songList', 'collect', 'profile'],
    }
  },
  created() {
    // 页面加载时读取sessionStorage里的状态
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state,
              JSON.parse(sessionStorage.getItem('store'))));
    }

    // 页面加载时读取localStorage里的状态
    if (localStorage.getItem('collectSongs')) {
      this.$store.state.collectSongs = JSON.parse(localStorage.getItem('collectSongs'));
    }
    if (localStorage.getItem('colSongList')) {
      this.$store.state.colSongList = JSON.parse(localStorage.getItem('colSongList'));
    }

    // 页面刷新时触发beforeunload事件将store添加到sessionStorage中
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state));
    });

    // 为了调试方便
    window.addEventListener('keypress', (e) => {
      if (e.code === 'Space') {
        if (this.getIsPlay) {
          this[types.SET_PLAY](!this.getIsPlay);
        } else {
          this[types.SET_PLAY](!this.getIsPlay);
        }
      } else if (e.code === 'Comma') {
        this[types.SET_PRE_SONG]();
      } else if (e.code === 'Period') {
        this[types.SET_NEXT_SONG]();
      }
    })
  },
  computed: {
    ...mapGetters([
        'getIsPlay',
        'getAudio'
    ])
  },
  methods: {
    ...mapMutations([
        types.SET_PLAY,
        types.SET_PRE_SONG,
        types.SET_NEXT_SONG
    ]),

    // 点击tab跳转到对应路由
    onTabClick(index) {
      this.$router.replace(`/${this.routes[index]}`);
    },
  },
  watch: {
    // 监听路由的变化自动矫正（比如刷新）
    $route(to, from) {
      this.$refs.tabControl.currentIndex = this.routes.indexOf(to.name);
    }
  }
}
</script>

<style lang="scss">
  @import "src/assets/css/normalized";
</style>