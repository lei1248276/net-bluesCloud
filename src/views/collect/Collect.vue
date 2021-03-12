<template>
  <div id="collect">
    <recommend-title :title="'收藏歌单'" class="titleSL">
      <img src="@/assets/img/icon/delete.png" alt="" class="trash" @click="onTrashSL">
    </recommend-title>
    <scroll class="content" :scroll-x="true" ref="songL">
      <song-list-item :data="getColSongList" :is-wrap="false"></song-list-item>
    </scroll>

    <recommend-title :title="'收藏歌曲'" class="titleSongs">
      <img src="@/assets/img/icon/delete.png" alt="" class="trash" @click="onTrashSongs">
    </recommend-title>
    <scroll class="content-two" ref="songs">
      <songs :song-list="getCollectSongs" :is-show-col="false"></songs>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/components/common/scroll/Scroll";
import RecommendTitle from "@/components/content/recommendTitle/RecommendTitle";
import SongListItem from "@/components/content/songListItem/SongListItem";
import Songs from "@/components/content/songs/Songs";

import {mapGetters, mapMutations} from 'vuex';
import types from "@/store/mutation-types";

export default {
  name: "Collect",
  components: {
    Scroll,
    RecommendTitle,
    SongListItem,
    Songs
  },
  activated() {
    this.$refs.songL.refresh();
    this.$refs.songs.refresh();
  },
  computed: {
    ...mapGetters([
        'getColSongList',
        'getCollectSongs'
    ])
  },
  methods: {
    ...mapMutations([
        types.DEL_COL_SONG_LIST,
        types.DELETE_COLLECT
    ]),

    onTrashSL() {
      if (this.getColSongList.length) {
        this[types.DEL_COL_SONG_LIST](true);
      }
    },
    onTrashSongs() {
      if (this.getCollectSongs.length) {
        this[types.DELETE_COLLECT](true);
      }
    }
  },
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  #collect{
    @include bsContent();
    background: rgba(185, 179, 187, .4);
    background: linear-gradient(to bottom, #cdd2cd, #5a6387);
    .titleSL{
      position: fixed;
      top: 102px;
      left: 0;
    }
    .trash{
      @include wh(32px, 30px);
      margin-right: 10px;
    }
    .trash:active{
      @include active();
    }
    .content{
      position: absolute;
      top: 137px;
      left: 0;
      right: 0;
      z-index: 10;
    }

    .titleSongs{
      position: fixed;
      top: 281px;
      left: 0;
    }
    .content-two{
      @include bsContent(316px, 54px);
    }
  }
</style>