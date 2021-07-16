<template>
  <div class="recommendTitle">
    <img :src="imgUrl" alt="" class="icon">
    <h2 class="title">{{this.title}}</h2>
    <router-link :to="path" v-if="path" class="more">>>></router-link>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "RecommendTitle",
  props: {
    title: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    imgUrl: {
      type: String,
      default: require('@/assets/img/rage/aei.png')
    }
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .recommendTitle{
    width: 100%;
    display: flex;
    align-items: center;
    .icon{
      @include wh(20px, 20px);
      margin-left: 4px;
    }
    .title{
      @include title();
    }
    .more{
      @include wh(40px, 35px);
      @include font(14px, 35px);
      text-align: right;
      padding-right: 10px;
      color: $active;
    }
  }
</style>