<template>
  <transition name="list_animation">
    <div class="playlist" ref="playlist">
      <!-- 网络等待动画 -->
      <load-wait v-if="!isLoading"></load-wait>

      <div class="mask" v-if="isLoading" ref="mask">
        <!-- 播放列表通用头部 -->
        <playlist-nav class="nav">
          <div class="bgImg" :style="{'background-image':'url(' + getPlaylistInfo.picUrl + '?param=500y60)','opacity': opacity}"></div>
          <h2 class="title">{{ navTitle }}</h2>
          <img src="@/assets/img/icon/search.png" alt="" class="search">
          <img src="@/assets/img/icon/more.png" alt="" class="more">
        </playlist-nav>

        <scroll class="content" ref="scroll" :probeType="1" @start="onStart"
                @scroll="onChangeNav">
          <!-- 播放列表描述信息 -->
          <div class="playlistInfo" :style="{'background-image':'url(' + getPlaylistInfo.picUrl + '?param=500y500)'}">
            <!-- 封面展示图 -->
            <div class="cover">
              <p class="count">
                <img src="@/assets/img/icon/play_icon.png" alt="" class="icon">
                <span>{{ getPlaylistInfo.playCount | count }}</span>
              </p>
              <img :src="getPlaylistInfo.picUrl + '?param=142y142'" alt="" class="img">
            </div>
            <!-- 封面内容详情 -->
            <div class="detail">
              <p class="detailName">{{ this.getPlaylistInfo.name }}</p>
              <div class="creator" v-if="getPlaylistInfo.creator">
                <img class="singer" :src="getPlaylistInfo.creator.avatarUrl + '?param=50y50'" alt="">
                <span class="singerName">{{ getPlaylistInfo.creator.nickname }}</span>
              </div>
            </div>
          </div>

          <!-- 播放列表歌曲展示 -->
          <songs :song-list="songList"></songs>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/components/common/scroll/Scroll";
import LoadWait from "@/components/content/loadWait/LoadWait";
import PlaylistNav from "@/components/content/playlistNav/PlaylistNav";
import Songs from "@/components/content/songs/Songs";

import {getPlaylistDetail, getPlaylistSongDetail} from "@/network/playlist";
import {mapGetters} from 'vuex';

export default {
  name: "Playlist",
  components: {
    Scroll,
    LoadWait,
    PlaylistNav,
    Songs
  },
  data() {
    return {
      isLoading: false,
      songList: null,
      opacity: 0,
      navTitle: '歌单',
    }
  },
  created() {
    // 初次加载网络数据
    this.loadData();
    // console.log(performance.now());
  },
  /*beforeRouteUpdate(to, from, next) {
    console.log(`beforeRouteUpdate`);
    this.loadData();
    next();
  },*/
  // 在页面销毁之前手动销毁better-scroll滚动事件（防止事件累加）
  beforeDestroy() {
    this.$refs.scroll.off('scroll', this.$refs.scroll.handleScroll);
  },
  computed: {
    ...mapGetters([
        'getPlaylistInfo',
    ]),
  },
  methods: {
    // 请求网络数据方法
    loadData() {
      getPlaylistDetail(this.getPlaylistInfo.id).then(res => {
        let trackIds = res.playlist.trackIds,
            len = trackIds.length,
            ids = trackIds[0].id;
        for (let i = 1; i < len; i++) {
          ids += `,${trackIds[i].id}`
        }
        return getPlaylistSongDetail(ids);
      }).then(res => {
        this.songList = res.songs;
        this.isLoading = true;
      }).catch(err => {
        console.log('歌单加载失败：' + err);
      })
    },

    // 根据滚动高度改变 nav样式
    onChangeNav(pos) {
      let opa = -pos / 200;
      if (opa <= 1) {
        this.opacity = opa;
        if(opa > 0.5) {
          this.navTitle = this.getPlaylistInfo.name;
        } else {
          this.navTitle = '歌单';
        }
      }
    },
    // better-scroll 开启
    onStart() {
      this.$refs.scroll.on('scroll', this.$refs.scroll.handleScroll);
    },
  },
  filters: {
    count(value) {
      let v = value + '';
      let length = v.length;
      return length > 8
          ? Math.round(v / 100000000) + '亿'
          : length > 4
              ? Math.round(v / 10000) + '万'
              : v;
    }
  },
  watch: {
    $route() {
      this.loadData();
    }
  }
}
</script>

<style scoped lang="scss">
  @import "/src/assets/css/base";
  .playlist{
    @include bsContent(0, 54px);
    background-color: #fff;
    z-index: 11;

    .nav{
      .bgImg{
        @include wh(100%, 100%);
        position: absolute;
      }
      .title{
        position: absolute;
        left: 15%;
        width: 60%;
        @include omit();
      }
      .search{
        position: absolute;
        right: 15%;
        padding: 5px;
      }
      .search:active{
        @include active();
      }
      .more{
        position: absolute;
        right: 2%;
      }
      .more:active{
        @include active();
      }
    }

    .content{
      @include bsContent();
      .playlistInfo{
        @include wh(100%, 235px);
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        background-size: 100% 100%;
        .cover {
          position: relative;
          top: 5%;
          left: 5%;
          .count{
            position: absolute;
            width: 100%;
            border-radius: 20px;
            @include fc(14px, white);
            background-color: rgba(0, 0, 0 , .2);
            padding: 0 6px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .icon{
              @include wh(26px, 26px)
            }
          }
          .img{
            @include wh(142px, 142px);
            border-radius: 20px;
          }
        }

        .detail{
          @include wh(53%, 140px);
          @include fc(20px, #fff);
          position: relative;
          left: 5%;
          top: 10%;
          .creator{
            display: flex;
            align-items: center;
            margin-top: 10px;
            .singer{
              @include wh(50px, 50px);
              border-radius: 50%;
            }
            .singerName{
              background-color: rgba(0, 0, 0 , .2);
              padding: 4px;
            }
          }
        }
      }
    }
  }

  .list_animation-enter-active {
    transition: all .5s ease;
  }
  .list_animation-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .list_animation-enter, .list_animation-leave-to {
    transform: translateX(70%);
    opacity: 0;
  }
</style>