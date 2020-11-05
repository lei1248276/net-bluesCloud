<template>
  <div class="player-control">
    <slot></slot>
    <img :src="prev" alt="" @click="onPreSong"
         :style="{'width': wh.w, 'height': wh.h}">
    <img :src="[getIsPlay ? pause : play]" alt="" @click="onPlay"
          :style="{'width': wh.w, 'height': wh.h}">
    <img :src="next" alt="" @click="onNextSong"
         :style="{'width': wh.w, 'height': wh.h}">
    <img :src="list" alt="" @click="onShowPlaylist"
         :style="{'width': wh.w, 'height': wh.h}">
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import types from "@/store/mutation-types";

export default {
  name: "PlayerControl",
  props: {
    list: {
      type: String,
      default: require('@/assets/img/playerPage/p_list.png')
    },
    prev: {
      type: String,
      default: require('@/assets/img/playerPage/p_prev.png')
    },
    next: {
      type: String,
      default: require('@/assets/img/playerPage/p_next.png')
    },
    play: {
      type: String,
      default: require('@/assets/img/playerPage/p_play.png')
    },
    pause: {
      type: String,
      default: require('@/assets/img/playerPage/p_pause.png')
    },
    wh: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters([
        'getCurrentPlayIndex',
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

    // 手动点击播放/暂停
    onPlay() {
      if (this.getIsPlay) {
        this[types.SET_PLAY](false);
      } else {
        this[types.SET_PLAY](true);
      }
    },
    // 点击上一首
    onPreSong() {
      // 当前播放为第一首时（默认循环播放）
      this[types.SET_PRE_SONG]();
    },
    // 点击下一首
    onNextSong() {
      // 当前播放为最后一首时（默认循环播放）
      this[types.SET_NEXT_SONG]();
    },
    onShowPlaylist() {
      this.$emit('onShowMask');
    },
  },
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .player-control{
    display: flex;
    align-items: center;
    justify-content: space-around;
    *{
      @include wh(32px, 32px);
      opacity: .8;
    }
  }
</style>