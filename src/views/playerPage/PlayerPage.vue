<template>
  <transition name="p_animation">
    <div id="player-page">
      <!--    背景图片    -->
      <img :src="getBgPic" alt="" class="bgImg" v-show="!isEmptyPlayer">

      <!--    主题背景    -->
      <div class="theme"></div>

      <!--    标题栏    -->
      <playlist-nav :is-share="true" class="p_title">
        <div>
          <p class="songName">{{ songName }}</p>
          <p class="singer">{{ singer }}</p>
        </div>
      </playlist-nav>

      <!--    页面动画    -->
      <div class="cdWrapper">
        <img src="@/assets/img/playerPage/needles.png" alt="" class="needles"
             :style="[getIsPlay ? {'transform': 'rotate(0)'} : {'transform': 'rotate(-20deg)'}]">
        <div class="cd" :style="[getIsPlay ? {'animation-play-state': 'running'} : {'animation-play-state': 'paused'}]">
          <img src="@/assets/img/playerPage/cd_wrapper.png" alt="" class="blackRecord">
          <img :src="getAnimationPic" alt="" class="cover">
        </div>
      </div>

      <!--    播放台     -->
      <div class="playBar">
        <!--    歌词    -->
        <div class="lyric">{{ this.getLrc }}</div>
        <!--    播放进度条     -->
        <div class="progressBar">
          <p class="startTime">{{ this.getProgressTime | time }}</p>
          <div class="line" ref="line">
            <p class="track" @click="onTimeline"></p>
            <p class="circle" :style="{'left': getProgressMove + '%'}"
               @touchstart="onChangeS" @touchmove="onChangingM" @touchend="onChangedE"
               :class="[isChange ? 'changeAnim' : '']"></p>
            <p class="rate" :style="{'width': getProgressMove + '%'}" @click="onTimeline"></p>
          </div>
          <p class="endTime">{{ this.getDuration | time }}</p>
        </div>
        <!--    控件    -->
        <player-control @onShowMask="onShowPlaylist" class="p_control" :wh="{w: '12%', h: '12%'}">
          <img :src="checkMode" alt="" @click="onMode">
        </player-control>
      </div>

      <!--    播放队列    -->
      <play-queue v-show="isShowMask" @offMask="onMask"></play-queue>
    </div>
  </transition>
</template>

<script>
import PlaylistNav from "@/components/content/playlistNav/PlaylistNav";
import PlayQueue from "@/components/content/playQueue/PlayQueue";
import PlayerControl from "@/components/content/playerControl/PlayerControl";

import {mapGetters, mapMutations} from 'vuex';
import types from "@/store/mutation-types";

export default {
  name: "PlayerPage",
  components: {
    PlaylistNav,
    PlayQueue,
    PlayerControl
  },
  data() {
    return {
      isShowMask: false,
      isChange: false,
      mode: [
          require('@/assets/img/playerPage/loop.png'),
          require('@/assets/img/playerPage/singleLoop.png')
      ],
      lrcTimeMap: [],
      lrcContMap: [],
    }
  },
  // 初次渲染组件处理歌词
  created() {
    this.handleLrc();
  },
  computed: {
    ...mapGetters([
        'getPlayerList',
        'getCurrentPlayIndex',
        'isEmptyPlayer',
        'getProgressTime',
        'getDuration',
        'getProgressMove',
        'getProgressRate',
        'getIsPlay',
        'getCurrentPlayLrc',
        'getCacheLrc',
        'getAudio',
        'getPlayMode'
    ]),
    getBgPic() {
      return !this.isEmptyPlayer
          ? this.getPlayerList[this.getCurrentPlayIndex].albumPic + '?param=500y800'
          : '';
    },
    getAnimationPic() {
      return !this.isEmptyPlayer
          ? this.getPlayerList[this.getCurrentPlayIndex].albumPic + '?param=165y165'
          : require('@/assets/img/playerPage/player-default.png');
    },
    songName() {
      return !this.isEmptyPlayer
          ? this.getPlayerList[this.getCurrentPlayIndex].name
          : '歌曲名称';
    },
    singer() {
      return !this.isEmptyPlayer
          ? this.getPlayerList[this.getCurrentPlayIndex].singer
          : '演唱者';
    },
    // 切换播放模式
    checkMode() {
      return this.mode[this.getPlayMode];
    },
    // 获取处理后的歌词（与播放时间相匹配就切换歌词）
    getLrc() {
      if (typeof this.lrcContMap === 'string') return this.lrcContMap;
      let time = this.lrcTimeMap,
          text = this.lrcContMap;
      for (let i = 0, { length } = time; i < length; i++) {
        if (time[i] >= this.getProgressTime) {
          return text[i - 1];
        }
      }
    }
  },
  methods: {
    ...mapMutations([
        types.SET_PLAY,
        types.SET_PROGRESS_TIME,
        types.SET_PLAY_MODE
    ]),

    // 点击control显示mask和播放列表
    onShowPlaylist() {
      this.isShowMask = true;
    },

    // 点击mask关闭播放列表
    onMask() {
      this.isShowMask = false;
    },

    // 点击切换播放模式
    onMode() {
      let l = this.mode.length - 1;
      this[types.SET_PLAY_MODE](this.getPlayMode === l ? 0 : 1);
      if (this.getAudio.loop = this.getPlayMode === 1) {
        this.$toast.show('洗脑模式');
      } else {
        this.$toast.show('列表循环');
      }
    },

    // 处理歌词
    handleLrc() {
      // 获取原始歌词
      const lrc = this.getCacheLrc || this.getCurrentPlayLrc;
        // 1、提取分钟（并没有提取完整，为了提取正确）
      let min = lrc.match(/^\[\d+/mg);
      // 2、判断是否有歌词
      if (min != null) {
        // 3、提取秒（并没有提取完整，为了提取正确）
        let sec = lrc.match(/:\d+\.\d+/mg);
        // 4、提取内容
        let content = lrc.split(/\[\d+:\d+.\d+]/g);
        // 5、剔除一些无意义内容（真是麻烦。。。。。）
        if (content[0][0] === '[' || content[0][0] == null) content.shift();
        // 6、分类数组
        let time = [], cont = [];
        for (let i = 0, {length} = min; i < length; i++) {
          // 7、进一步提取分钟
          let m = parseInt(min[i].replace('[', '')) * 60;
          // 8、进一步提取秒
          let s = Number(sec[i].replace(':', ''));
          // 9、添加到时间分类数组
          time[i] = m + s;
          // 10、添加到内容内类数组
          cont[i] = content[i];
        }
        this.lrcTimeMap = time;
        this.lrcContMap = cont;
      } else {
        // 没有歌词的情况
        this.lrcContMap = '该歌曲没有歌词！';
      }
    },

    // touch滚轴开始时
    onChangeS(e) {
      this.isChange = true;
      this.getAudio.pause();
      this[types.SET_PLAY](false);
      // 获取开始位置
      this.startX = e.touches[0].pageX - e.target.offsetLeft;
      // 计算差值（因为歌曲时间与移动距离不相等）
      this.DValue = this.getDuration / this.$refs.line.clientWidth;
    },

    // touch滚轴移动时
    onChangingM(e) {
      // 获取移动距离
      this.distance = e.touches[0].pageX - this.startX;
      // 临界值处理
      if (this.distance <= 0) {
        this.distance = 0
      } else if (this.distance >= this.$refs.line.clientWidth) {
        this.distance = this.$refs.line.clientWidth;
      }
      e.target.style.left = (this.distance * this.getProgressRate) + '%';
      this[types.SET_PROGRESS_TIME](this.distance * this.DValue);
    },

    // touch滚轴结束时
    onChangedE() {
      this.isChange = false;
      this[types.SET_PLAY](true);
      // 根据移动距离修改歌曲时间
      if (this.distance != null) {
        this.getAudio.currentTime = this.distance * this.DValue;
      }
    },

    // 点击时间线时
    onTimeline(e) {
      // 计算差值（因为歌曲时间与移动距离不相等）
      this.DValue = this.getDuration / this.$refs.line.clientWidth;
      const x = e.offsetX;
      this[types.SET_PROGRESS_TIME](Math.floor(x * this.DValue));
      this.getAudio.currentTime = Math.floor(x * this.DValue);
    }
  },
  watch: {
    // 切换歌曲重新处理歌词
    getDuration() {
      if (!this.isEmptyPlayer) {
        console.log(`更新`);
        this.handleLrc();
      }
    }
  },
  filters: {
    time(v) {
      let m, s;
      m = Math.floor(v / 60) + '';
      s = Math.floor(v % 60) + '';
      if (m.length === 1) m = '0' + m;
      if (s.length === 1) s = '0' + s;
      return m + ':' + s;
    }
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  #player-page{
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 12;
    overflow: hidden;
    .theme{
      background-color: rgba(0, 0 , 0, .4);
      @include bsContent();
    }
    .p_title{
      border-bottom: 1px solid rgba(255, 255, 255, .4);
      .songName{
        width: 260px;
      }
      .singer{
        color: #d6d3d3;
      }
    }
    .bgImg{
      @include wh(100%, 100%);
    }
    .cdWrapper{
      @include wh(100%, 62%);
      position: absolute;
      top: 56px;
      left: 0;
      right: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      .needles{
        width: 100px;
        margin-top: -16px;
        transform-origin: top center;
        transition: transform 1s;
        @include speed();
        z-index: 1000;
      }
      .cd{
        @include wh(260px, 260px);
        position: relative;
        bottom: 45px;
        animation: playAnim 15s linear infinite;
        animation-play-state: running;
        @include speed();
        .blackRecord{
          width: 100%;
        }
        .cover{
          width: 68%;
          border-radius: 50%;
          @include center();
        }
      }
    }
    .playBar{
      position: absolute;
      bottom: 6%;
      left: 0;
      right: 0;
      text-align: center;
      color: #fff;
      .range{
        width: 200px;
      }
      .progressBar{
        @include wh(100%, 30px);
        position: relative;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: #bdbdbd;
        overflow: hidden;
        .line{
          @include wh(60%, 100%);
          position: relative;
          display: flex;
          align-items: center;
          .track{
            @include wh(100%, 2px);
            background-color: #bdbdbd;
          }
          .circle{
            @include wh(18px, 18px);
            border-radius: 50%;
            background-color: $bc;
            position: absolute;
            margin-left: -5px;
            @include speed();
            transition: all .1s linear;
          }
          .changeAnim{
            transform: scale(1.3);
          }
          .rate{
            @include wh(100%, 2px);
            position: absolute;
            background-color: $bc;
            @include speed();
          }
        }
      }
      .lyric{
        @include wh(80%, 40px);
        margin: 0 auto;
        font-size: 18px;
        overflow: hidden;
      }
    }
    .p_control{
      width: 80%;
      margin: 15px auto 0;
      img{
        @include wh(12%, 12%);
      }
    }
  }

  @keyframes playAnim {
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }

  .p_animation-enter-active {
    transition: all .5s ease;
  }
  .p_animation-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .p_animation-enter, .p_animation-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
</style>