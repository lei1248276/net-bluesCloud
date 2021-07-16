<template>
  <div class="playlist-nav">
    <div class="back" @click="onBack"></div>
    <slot></slot>
    <img src="@/assets/img/playlistNav/share.png" alt="" class="share" v-show="isShare">
  </div>
</template>

<script>
export default {
  name: "PlaylistNav",
  props: {
    isShare: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .playlist-nav{
    @include wh(100%, 56px);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    @include speed();
    background-color: transparent;
    display: flex;
    align-items: center;
    color: #fff;
    .back{
      @include wh(60px, 100%);
      position: relative;
      z-index: 1111;
      line-height: 56px;
      text-align: center;
      background: url("~@/assets/img/playlistNav/back.png") 15px center/50% no-repeat;
    }
    .back:active{
      @include active();
    }
    .share{
      @include wh(40px, 40px);
      position: absolute;
      right: 20px;
      padding: 5px;
    }
    .share:active{
      @include active();
    }
  }

</style>