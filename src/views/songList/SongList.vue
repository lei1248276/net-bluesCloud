<template>
  <div id="song-list">
    <!-- 网络请求等待动画 -->
    <load-wait v-if="isLoading"></load-wait>

    <!--全部歌单-->
    <scroll class="content" v-if="!isLoading" ref="scroll"
            @start="onStart" @pullingUp="loadMore">
      <recommend-title :title="'全部歌单'"></recommend-title>
      <song-list-item :data="songListAll" @isLoadedImg="isLoadedImg" :col="2"></song-list-item>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/components/common/scroll/Scroll";
import LoadWait from "@/components/content/loadWait/LoadWait";
import RecommendTitle from "@/components/content/recommendTitle/RecommendTitle";
import SongListItem from "@/components/content/songListItem/SongListItem";

import {getSongListAll} from "@/network/songList";

export default {
  name: "SongList",
  components: {
    Scroll,
    LoadWait,
    RecommendTitle,
    SongListItem
  },
  data() {
    return {
      offset: 0,
      songListAll: [],
      isLoading: true
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      getSongListAll(this.offset, 30)
          .then(res => {
            let total = res.total;
            this.songListAll.push(...res.playlists);
            // console.log(this.songListAll);
            this.offset = this.offset + 30;
            if (this.offset > total) this.offset = total;
            this.isLoading = false;
          })
          .catch(err => {
            console.log(err);
          });
    },

    // 图片加载完后回调刷新高度
    isLoadedImg() {
      this.$refs.scroll.refresh();
    },

    // better-scroll 开启
    onStart() {
      this.$refs.scroll.on('pullingUp', this.$refs.scroll.handlePullingUp);
    },

    // 下拉加载更多
    loadMore() {
      // console.log('下拉加载');
      this.loadData();
      this.$refs.scroll.finishPullUp();
    }
  },
  watch: {
    songListAll() {
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  #song-list{
    @include bsContent();
    .content{
      @include bsContent(102px, 54px);
    }
  }
</style>