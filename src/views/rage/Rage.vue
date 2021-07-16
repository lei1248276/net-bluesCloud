<template>
  <div id="rage">
    <!-- 网络请求等待动画 -->
<!--    <h1>{{time}}</h1>-->
    <load-wait v-if="isLoaded"></load-wait>
    <scroll class="content" ref="scroll" v-if="!isLoaded">
      <!-- rage页面轮播图 -->
      <rage-swiper :bannerList="bannerList"></rage-swiper>
      <!-- rage页面推荐歌单 -->
      <rage-recommendSL :recommendSL="recommendSL"></rage-recommendSL>
      <!-- rage页面推荐MV -->
      <rage-recommendMV :recommendMV="recommendMV" @onRefresh="isLoadedImg"></rage-recommendMV>
    </scroll>
<!--    <iframe src="http://localhost:8081/home" style="display: none" class="iframe"></iframe>-->
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
      time: 0
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
  /*mounted() {
    let that = this;
    let frame = document.querySelector('.iframe');
    window.onclick = function send () {
      frame.contentWindow.postMessage(Date.now(), 'http://localhost:8081/home');
    }

    window.onmessage = function (e) {
      if (typeof e.data === 'number') {
        // that.time = e.data;
        // this.localStorage.setItem('share', e.data);
        document.cookie = `time=${e.data}`
        that.time = document.cookie;
        // console.log(that.$route);
      }
    };
    /!*window.onstorage = function (e) {
      that.time = e.newValue;
      console.log(document.cookie);
    };*!/

  },*/
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
  },
  watch: {
    time(newValue) {
      console.log(newValue);
    }
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  #rage{
    @include bsContent(0, 54px);
    h1{
      text-align: center;
      font-size: 36px;
      background-color: red;
      position: relative;
      z-index: 99999;
    }
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