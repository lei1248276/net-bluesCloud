<template>
  <div class="swiper-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
name: "SwiperItem"
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .swiper-item{
    display: flex;
  }
</style>