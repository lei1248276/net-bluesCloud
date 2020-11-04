<template>
  <swiper v-if="Object.keys(this.bannerList).length > 0">
    <swiper-item>
      <img :src="items.imageUrl" alt="" class="slide"
           v-for="(items, index) in bannerList" :key="index">
    </swiper-item>
  </swiper>
</template>

<script>
import Swiper from "@/components/common/swiper/Swiper";
import SwiperItem from "@/components/common/swiper/SwiperItem";
// import {debounce} from "@/common/util";

export default {
  name: "RageSwiper",
  components: {
    Swiper,
    SwiperItem
  },
  props: {
    bannerList: {
      type: Array,
      default() {
        return []
      }
    },
  },
  /*methods: {
    // 使用防抖函数减少发出 $emit事件次数
    isLoad: debounce(function () {
      this.$emit('isLoadedImg');
    })
  }*/
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .slide{
    flex-shrink: 0;
    @include wh(100%, 174px);
  }
</style>