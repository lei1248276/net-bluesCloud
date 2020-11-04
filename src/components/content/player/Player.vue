<template>
  <div class="player">
    <!--    mini播放机     -->
    <div class="playerWrapper">

      <!--    播放歌曲信息    -->
      <div class="songInfo" @click="toPlayerPage">
        <img :src="getAlbumPic" alt="" class="cover">
        <!-- 歌曲加载动画图片 -->
        <div class="loadMask" v-show="isLoad">
          <img src="@/assets/img/player/music.png" alt="" class="loadPic">
        </div>
        <div class="songDetail">
          <p class="songName">{{ getSongName }}</p>
          <p class="player-singer">{{ getSinger }}</p>
        </div>
      </div>

      <!--    播放进度条     -->
      <div class="progressBar" :style="{'transform': 'translate3d('+ getProgressMove + '%, 0, 0)'}"></div>

      <!--    player控件    -->
      <player-control :prev="prev" :pause="pause" :play="play" :next="next" :list="list"
                      @onShowMask="onShowPlaylist" class="control">
      </player-control>
    </div>


    <!--    播放队列    -->
    <play-queue v-show="isShowMask" @click.native.self="onMask" @offMask="onMask"></play-queue>

    <!--    播放器   -->
    <audio ref="audio" :src="audioSrc" autoplay @canplay="isCanplay" @ended="isEnded"
           @timeupdate="currentTime" @error="isErr" @loadstart="onLoadstart"></audio>
  </div>
</template>

<script>
import PlayQueue from "@/components/content/playQueue/PlayQueue";
import PlayerControl from "@/components/content/playerControl/PlayerControl";

import {mapGetters, mapMutations} from 'vuex';
import types from "@/store/mutation-types";

export default {
  name: "Player",
  components: {
    PlayQueue,
    PlayerControl
  },
  data() {
    return {
      isShowMask: false,
      isLoad: false,
      prev: require('@/assets/img/player/previous.png'),
      pause: require('@/assets/img/player/pause.png'),
      play: require('@/assets/img/player/playerPlay.png'),
      next: require('@/assets/img/player/next.png'),
      list: require('@/assets/img/player/playlist.png'),
    }
  },
  mounted() {
    this.$nextTick(() => {
      this[types.SET_AUDIO](this.$refs.audio);
    })
  },
  computed: {
    // 获取播放列表
    ...mapGetters([
        'getPlayerList',
        'getCurrentPlayIndex',
        'getPlayerLength',
        'getCurrentPlayUrl',
        'getCacheUrl',
        'getIsPlay',
        'getAudio',
        'getProgressMove'
    ]),
    audioSrc() {
      if (this.getPlayerLength > 0) {
        if (this.getCacheUrl) {
          return this.getCacheUrl;
        } else {
          return this.getCurrentPlayUrl;
        }
      } else {
        return '';
      }
    },
    getAlbumPic() {
      return this.getPlayerLength > 0
          ? this.getPlayerList[this.getCurrentPlayIndex].albumPic + '?param=54y52'
          : require('@/assets/img/playerPage/player-default.png');
    },
    getSongName() {
      return this.getPlayerLength > 0
          ? this.getPlayerList[this.getCurrentPlayIndex].name
          : '歌曲名称';
    },
    getSinger() {
      return this.getPlayerLength > 0
          ? this.getPlayerList[this.getCurrentPlayIndex].singer
          : '演唱者';
    },
  },
  methods: {
    ...mapMutations([
        types.SET_PROGRESS_RATE,
        types.SET_DURATION,
        types.SET_NEXT_SONG,
        types.SET_PROGRESS_TIME,
        types.SET_PLAY,
        types.SET_AUDIO,
        types.SET_PLAYLIST_INFO
    ]),

    // 跳转到对应歌曲详情页面
    toPlayerPage() {
      if (this.getPlayerLength) {
        this.$router.push(`/playerPage/${this.getPlayerList[this.getCurrentPlayIndex].id}`);
      }
    },

    // 点击显示播放列表
    onShowPlaylist() {
      this.isShowMask = true;
    },

    // 点击 mask隐藏播放列表
    onMask() {
      this.isShowMask = false;
    },

    // audio开始加载时
    onLoadstart() {
      if (this.getPlayerLength) {
        this.isLoad = true;
      }
    },

    // audio可以播放时
    isCanplay() {
      // this.getAudio.play();
      this.isLoad = false;
      this[types.SET_PLAY](true);
      this[types.SET_PROGRESS_RATE]((100 / this.getAudio.duration).toFixed(3));
      this[types.SET_DURATION](Math.round(this.getAudio.duration));
    },

    // audio播放结束时
    isEnded() {
      this[types.SET_NEXT_SONG]();
    },

    // audio当前播放时间进度
    currentTime() {
      this[types.SET_PROGRESS_TIME](this.getAudio.currentTime);
    },

    // audio报错时
    isErr() {
      if (this.getPlayerLength) {
        this[types.SET_NEXT_SONG]();
      }
    },
  },
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base.scss";
  .playerWrapper{
    @include wh(100%, 54px);
    border-radius: 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 11;
    display: flex;
    background-image: linear-gradient( 135deg, #FFF6B7 10%, #F6416C 100%);
    overflow: hidden;
    align-items: center;
    justify-content: center;
    .songInfo{
      display: flex;
      flex: 1;
      .songDetail{
        width: 140px;
        padding-left: 5px;
        line-height: 1.5;
        .songName{
          color: #333;
          @include omit();
        }
        .player-singer{
          color: #666;
          @include omit();
        }
      }
      .cover{
        @include wh(54px, 52px);
      }
      .loadMask{
        position: absolute;
        background-color: #fff;
        .loadPic{
          @include wh(54px, 52px);
          animation: load 2s linear infinite alternate;
        }
      }
    }
    .control{
      flex: 1.5;
    }
    .progressBar{
      @include wh(93%, 2px);
      position: absolute;
      bottom: 0;
      left: -90%;
      background-color: $bc;
      z-index: 999;
    }
  }

  @keyframes load {
    0%{
      opacity: 1;
    }
    100%{
      opacity: 0;
    }
  }
</style>