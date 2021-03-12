<template>
  <div id="rage">
    <!-- 网络请求等待动画 -->
    <load-wait v-if="isLoaded"></load-wait>
    <scroll class="content" ref="scroll" v-if="!isLoaded">
      <!-- rage页面轮播图 -->
      <rage-swiper :bannerList="bannerList"></rage-swiper>
      <!-- rage页面推荐歌单 -->
      <rage-recommendSL :recommendSL="recommendSL"></rage-recommendSL>
      <!-- rage页面推荐MV -->
      <rage-recommendMV :recommendMV="recommendMV" @onRefresh="isLoadedImg"></rage-recommendMV>
    </scroll>
  </div>
</template>

<script>
import {getBannerList, getPersonalized, getPersonalizedMV} from "@/network/rage";
import RageSwiper from "@/views/rage/childComps/RageSwiper";
import RageRecommendSL from "@/views/rage/childComps/RageRecommendSL";
import RageRecommendMV from "@/views/rage/childComps/RageRecommendMV";
import Scroll from "@/components/common/scroll/Scroll";
import LoadWait from "@/components/content/loadWait/LoadWait";

export default {
  name: "Rage",
  data() {
    return {
      bannerList: null,
      recommendSL: null,
      recommendMV: null,
      isLoaded: true,
    }
  },
  components:{
    RageSwiper,
    RageRecommendSL,
    RageRecommendMV,
    Scroll,
    LoadWait
  },
  created() {
    this.loadData();
    // console.log(performance.getEntriesByType('navigation'));
  },
  methods: {
    loadData() {
      Promise.all([getBannerList(), getPersonalized(), getPersonalizedMV()])
          .then(res => {
            this.bannerList = res[0].banners;
            // console.log(this.bannerList);
            this.recommendSL = res[1].result;
            // console.log(this.recommendSL);
            this.recommendMV = res[2].result;
            // console.log(this.recommendMV);
            this.isLoaded = false;
          })
          .catch(err => {
            console.log(err);
          });
    },

    // 刷新scroll滚动高度
    isLoadedImg() {
      this.$refs.scroll.refresh();
    }
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  #rage{
    @include bsContent(0, 54px);
  }
  .loadWait{
    @include center();
    z-index: 999;
    text-align: center;
    font-size: 22px;
    .loading{
      animation: rotating 4s linear infinite;
    }
  }

  .content{
    @include bsContent(102px, 0);
  }

  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>