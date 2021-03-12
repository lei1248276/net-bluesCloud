<template>
  <div class="songs">
    <div class="listControl">
      <div class="playAll" @click="onPlayAll">播放全部</div>
      <div class="addAll" @click="onAddAll">全部添加</div>
      <div :class="[isColSongList(getPlaylistInfo.id) ? 'isCollected' : 'colSongList']"
           @click="onColSongList(getPlaylistInfo)" v-if="isShowCol">收藏歌单</div>
    </div>
    <div class="songItem" v-for="(items, index) in songList" :key="items.id"
         @click="onAddSong(index, items)">
      <img :src="[isCollect(items.id) ? collect[0] : collect[1]]" alt="" @click.stop="onCollect(items)">
      <p class="songNum" :class="{activeNum: getCurrentPlayID === items.id}">{{ index + 1 }}</p>
      <div class="songInfo">
        <div class="songName" :class="{activeName: getCurrentPlayID === items.id}">
          {{ items.name }}
        </div>
        <div class="songSinger">{{ items.singer || items.ar[0].name}}</div>
      </div>
      <img src="@/assets/img/icon/detail.png" alt=""
           @click.stop="onSongDetail" @touchstart="onTouchS" @touchend="onTouchE">
    </div>
  </div>
</template>

<script>
import {debounce} from "@/common/util";
import {mapGetters, mapMutations} from 'vuex';
import types from "@/store/mutation-types";

export default {
  name: "Songs",
  props: {
    songList: {
      type: Array,
      default() {
        return []
      }
    },
    isShowCol: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      collect: [
        require('@/assets/img/songs/heartArrow.png'),
        require('@/assets/img/songs/heart.png')
      ],
    }
  },
  computed: {
    ...mapGetters([
      'getPlaylistInfo',
      'getPlayerList',
      'getCurrentPlayID',
      'getCurrentPlayIndex',
      'getAudio',
      'getCollectSongs',
      'getColSongList'
    ]),
  },
  methods: {
    ...mapMutations([
      types.SET_IS_SHOW,
      types.DELETE_ALL,
      types.ADD_SONG,
      types.SET_PLAY,
      types.SET_CURRENT_PLAY_INDEX,
      types.ADD_COLLECT,
      types.DELETE_COLLECT,
      types.ADD_COL_SONG_LIST,
      types.DEL_COL_SONG_LIST
    ]),

    // 点击全部播放
    onPlayAll: debounce(function () {
      // 显示 player
      this[types.SET_IS_SHOW]();
      // 先清空全部在添加
      this[types.DELETE_ALL]();
      const arr = [];
      this.songList.forEach((value, index) => {
        arr.push({
          id: value.id,
          name: value.name,
          singer: value.singer || value.ar[0].name,
          albumPic: value.albumPic || value.al.picUrl,
          fromPL: this.$route.name === 'collect'
              ? this.getCollectSongs[index].fromPL
              : this.getPlaylistInfo
        })
      });
      this[types.ADD_SONG](arr);
      this[types.SET_PLAY](true);
      this[types.SET_CURRENT_PLAY_INDEX](0);
      this.$store.dispatch('getSong', arr[0].id)
          .then(res => {
            this.$toast.show(res);
          })
          .catch(err => {
            this.$toast.show(err);
          });
    }),

    // 点击全部添加
    onAddAll: debounce(function () {
      // 显示 player
      this[types.SET_IS_SHOW]();

      const songs = this.songList;
      let count = 0,
          arr = [];
      for (let i = 0, {length} = songs; i < length; i++) {
        if (!this.getPlayerList.find(value => value.id === songs[i].id)) {
          arr.push({
            id: songs[i].id,
            name: songs[i].name,
            singer: songs[i].singer || songs[i].ar[0].name,
            albumPic: songs[i].albumPic || songs[i].al.picUrl,
            fromPL: this.$route.name === 'collect'
                ? this.getCollectSongs[i].fromPL
                : this.getPlaylistInfo
          });
          count++;
        }
      }
      this[types.ADD_SONG](arr);

      this.$toast.show('添加成功');

      if (this.getCurrentPlayID) {
        this[types.SET_CURRENT_PLAY_INDEX](this.getCurrentPlayIndex + count);
      }
    }),

    // 点击添加歌曲并播放
    onAddSong: debounce(function (index, song) {
      // 显示 player
      this[types.SET_IS_SHOW]();
      // 1.判断添加歌曲是否添加过
      if (!this.getPlayerList.find(value => value.id === song.id)) {
        // 1.2.不存在就添加到播放列表
        this[types.ADD_SONG]({
          id: song.id,
          name: song.name,
          singer: song.singer || song.ar[0].name,
          albumPic: song.albumPic || song.al.picUrl,
          fromPL: this.$route.name === 'collect'
              ? this.getCollectSongs[index].fromPL
              : this.getPlaylistInfo
        });
        this[types.SET_CURRENT_PLAY_INDEX](0);

      } else {
        // 2.如果存在就跳到该歌曲index
        this[types.SET_CURRENT_PLAY_INDEX](this.getPlayerList.findIndex(value => value.id === song.id));
        this.getAudio.currentTime = 0;
      }
      this[types.SET_PLAY](true);
      this.$store.dispatch('getSong', song.id);
    }),

    // 收藏歌曲
    onCollect(item) {
      let index = this.getCollectSongs.findIndex(value => value.id === item.id);
      if (index === -1) {
        this[types.ADD_COLLECT]({
          id: item.id,
          name: item.name,
          singer: item.singer || item.ar[0].name,
          albumPic: item.albumPic || item.al.picUrl,
          fromPL: this.getPlaylistInfo
        });
      } else {
        this[types.DELETE_COLLECT](index);
      }
    },

    // 判断该歌曲是否收藏过
    isCollect(id) {
      return this.getCollectSongs.find(value => value.id === id);
    },

    // 添加收藏歌单/删除收藏歌单
    onColSongList(items) {
      let index = this.getColSongList.findIndex(value => value.id === items.id);
      if (index === -1) {
        this[types.ADD_COL_SONG_LIST](items);
      } else {
        this[types.DEL_COL_SONG_LIST](index);
      }
    },

    // 判断该歌单是否收藏过
    isColSongList(id) {
      return this.getColSongList.find(value => value.id === id);
    },

    // 点击歌曲详情
    onSongDetail() {

    },
    // active无效。。。。
    onTouchS(e) {
      e.target.className = 'songDe';
    },
    onTouchE(e) {
      e.target.className = '';
    }
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .songs{
    @include wh(100%, 100%);
    .listControl{
      border-bottom: 1px solid rgba(0, 0, 0, .2);
      color: #666;
      *{
        display: inline-block;
        padding: 10px 0 10px 50px;
      }
      .playAll{
        background: url("~@/assets/img/songs/playAll.png") 15px/30px no-repeat;
      }
      .addAll{
        background: url("~@/assets/img/icon/add.png") 15px/30px no-repeat;
      }
      .colSongList{
        background: url("~@/assets/img/songs/collect.png") 15px/30px no-repeat;
      }
      .isCollected{
        background: url("~@/assets/img/songs/collect_active.png") 15px/30px no-repeat;
        color: $bc;
      }
    }
    .songItem{
      display: flex;
      align-items: center;
      padding: 10px 0 0 12px;
      color: #666;
      @include font(18px, 25px);

      .songNum{
        flex: 0 0 30px;
        text-align: center;
        font-weight: bold;
        font-size: 22px;
      }
      .activeNum{
        color: #7e57c2;
      }
      .songInfo{
        width: 260px;
        border-bottom: 1px solid rgba(0, 0, 0, .2);
        .songName{
          color: #333;
          @include omit();
        }
        .songSinger{
          font-size: 14px;
        }
      }
      .activeName{
        color: $bc !important;
      }
      .songDe{
        background-color: rgba(0, 0, 0, .2);
        border-radius: 50%;
      }
    }
  }
</style>