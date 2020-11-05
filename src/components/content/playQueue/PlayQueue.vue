<template>
  <transition name="animation">
    <div class="play-queue">
      <div class="playlist">
        <div class="listNav">
          <p class="title">播放列表({{ this.getSizePlayer }})</p>
          <img :src="checkMode" alt="" class="mode" @click="onMode">
          <p class="collection" @click="onColAll">收藏全部</p>
          <img src="@/assets/img/icon/delete.png" alt="" class="trash" @click="onDeleteAll">
        </div>
        <div class="list">
          <div class="listItems" v-for="(items, index) in getPlayerList" :key="index"
               :class="{isActive: getCurrentPlayIndex === index}" @click="onSwitchSong(index)">
            <div class="listInfo">
              <p class="name">{{ items.name }}</p>
              <span class="singer"> -- {{ items.singer }}</span>
            </div>
            <p class="source" v-show="getCurrentPlayIndex === index"
               @click.stop="onSource(items)">播放来源</p>
            <i @click.stop="onDeleteSong(index)" class="delete">X</i>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import types from "@/store/mutation-types";

export default {
  name: "PlayQueue",
  data() {
    return {
      mode: [
        require('@/assets/img/icon/q_loop.png'),
        require('@/assets/img/icon/q_singleLoop.png')
      ],
    }
  },
  computed: {
    // 获取播放列表
    ...mapGetters([
        'getPlayerList',
        'getCurrentPlayID',
        'getCurrentPlayIndex',
        'isEmptyPlayer',
        'getSizePlayer',
        'getAudio',
        'getCollectSongs',
        'getPlaylistInfo',
        'getPlayMode'
    ]),
    // 切换播放模式
    checkMode() {
      return this.mode[this.getPlayMode];
    },
  },
  methods: {
    ...mapMutations([
      types.DELETE_SONG,
      types.SET_CURRENT_PLAY_INDEX,
      types.SET_PLAY,
      types.DELETE_ALL,
      types.SET_PLAYLIST_INFO,
      types.ADD_COLLECT,
      types.SET_PLAY_MODE
    ]),

    // 删除全部歌曲
    onDeleteAll() {
      this[types.DELETE_ALL]();
      this.$emit('offMask');
    },

    // 删除指定歌曲
    onDeleteSong(index) {
      // 1.执行删除操作
      this[types.DELETE_SONG](index);

      // 2.删除项是最后一项（因为首先执行删除，列表长度减少）且不是当前播放歌曲时
      if (!this.isEmptyPlayer
          && this.getSizePlayer === index
          && index === this.getCurrentPlayIndex) {
        this[types.SET_CURRENT_PLAY_INDEX](this.getCurrentPlayIndex - 1);
      }
      // 3.删除项是当前播放歌曲并且总长度大于1时（保持index不变）
      if (!this.isEmptyPlayer && index === this.getCurrentPlayIndex) {
        this[types.SET_CURRENT_PLAY_INDEX](this.getCurrentPlayIndex);
        this[types.SET_PLAY](true);
        this.$store.dispatch('getSong', this.getCurrentPlayID)
            .then(res => {
              this.$toast.show(res);
            })
            .catch(err => {
              this.$toast.show(err);
            });
      } else {
        // 3.1删除项不是当前播放歌曲并且小于当前播放歌曲index（index减小）
        if (index < this.getCurrentPlayIndex) {
          this[types.SET_CURRENT_PLAY_INDEX](this.getCurrentPlayIndex - 1);
        }
        // 删除项不是当前播放歌曲并且大于当前播放歌曲index（此情况不考虑）
      }

      if (this.isEmptyPlayer) {
        this.$emit('offMask');
      }
    },

    // 点击切换歌曲
    onSwitchSong(index) {
      if (index === this.getCurrentPlayIndex) {
        this.getAudio.currentTime = 0;
      }
      this[types.SET_CURRENT_PLAY_INDEX](index);
      this[types.SET_PLAY](true);
      this.$store.dispatch('getSong', this.getPlayerList[index].id);
    },

    // 点击访问歌曲来源
    onSource(song) {
      const id = song.fromPL.id;
      if (id !== +this.$route.params.id) {
        this.$router.push(`/playlist/${id}`);
        this[types.SET_PLAYLIST_INFO](song.fromPL);
        this.$emit('offMask');
      }
    },

    // 点击全部收藏
    onColAll() {
      const list = this.getPlayerList, arr = [];
      for (let i = 0, { length } = list; i < length; i++) {
        if (!this.getCollectSongs.find(value => value.id === list[i].id)) {
          arr.push(list[i])
        }
      }
      this[types.ADD_COLLECT](arr);
      this.$toast.show('收藏成功');
    },

    // 点击切换播放模式
    onMode() {
      let i = this.getPlayMode;
      let l = this.mode.length - 1;
      this[types.SET_PLAY_MODE](i === l ? 0 : i + 1);
      this.getAudio.loop = this.getPlayMode === 1;
      if (this.getPlayMode === 1) {
        this.$toast.show('洗脑模式');
      } else {
        this.$toast.show('列表循环');
      }
    },
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .play-queue{
    background-color: rgba(0, 0, 0, .5);
    @include bsContent();
    z-index: 1000;
    .playlist{
      @include wh(95%, 46%);
      border-radius: 20px;
      color: #666;
      background-color: #fff;
      position: fixed;
      bottom: 10px;
      left: 0;
      right: 0;
      margin: 0 auto;
      overflow-y: scroll;
      .listNav{
        @include wh(95%, 45px);
        border-radius: 20px 20px 0 0;
        position: fixed;
        line-height: 45px;
        font-size: 16px;
        background-color: #fff;
        .title{
          width: 150px;
          font-size: 20px;
          font-weight: bold;
          padding: 0 10px;
        }
        .mode{
          @include wh(36px, 36px);
          position: absolute;
          right: 150px;
          top: 4px;
          padding: 5px;
        }
        .collection{
          @include wh(90px, 45px);
          text-align: right;
          position: absolute;
          top: 0;
          right: 50px;
          background: url(~@/assets/img/icon/add.png) 0 10px/24px no-repeat;
        }
        .trash{
          @include wh(30px, 30px);
          position: absolute;
          right: 8px;
          top: 5px;
        }
      }
      .list{
        margin-top: 42px;
        .listItems{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .listInfo{
            width: 60%;
            padding: 10px 5px;
            @include omit();
            .name{
              display: inline-block;
              font-weight: bold;
            }
            .singer{
              font-size: 14px;
            }
          }
          .source{
            display: inline-block;
            @include wh(80px, 100%);
            @include fc(14px, #333);
            border-radius: 10px;
            padding: 3px;
            text-align: center;
            border: 1px solid rgba(0, 0, 0, .3);
          }
          .source:active{
            background-color: rgba(0, 0, 0, .3);
          }
          .delete{
            padding: 13px 20px 13px 5px;
          }
        }
      }

      .isActive{
        color: $active;
      }
    }
  }

  .animation-enter-active {
    transition: all .5s ease;
  }
  .animation-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .animation-enter, .animation-leave-to {
    transform: translateY(40%);
    opacity: 0;
  }
</style>