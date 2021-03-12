<template>
  <div class="songListItem" :style="{'flex-wrap': isWrap ? 'wrap' : 'nowrap'}">
    <div class="item" v-for="(items, index) in data" :key="index" ref="item"
         @click="toPlaylist({
              id: items.id,
              name: items.name,
              picUrl: items.picUrl || items.coverImgUrl,
              creator: items.creator,
              playCount: items.playCount})" v-if="data.length">
      <img :src="items.picUrl || items.coverImgUrl" alt="" class="img" @load="isLoad">
      <p class="songDetail">{{items.name}}</p>
      <p class="playCount">
        <img src="@/assets/img/icon/play_icon.png" alt="" class="icon">
        <span>{{items.playCount | count}}</span>
      </p>
    </div>
    <p class="backUp" v-if="!data.length">暂无歌单</p>
  </div>
</template>

<script>
import types from "@/store/mutation-types";
import {mapMutations} from 'vuex';

export default {
  name: "songListItem",
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    col: {
      type: Number,
      default: 1
    },
    isWrap: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.autoLayout();
  },
  updated() {
    this.autoLayout();
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
  methods: {
    ...mapMutations([
        types.SET_PLAYLIST_INFO
    ]),

    autoLayout() {
      if (this.data != null && this.data.length) {
        this.$refs.item.forEach(value => {
          value.style.flex = `0 1 ${99 / this.col}%`;
        })
      }
    },
    /* 图片加载完后通知better-scroll刷新滚动高度*/
    isLoad() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$emit('isLoadedImg');
        this.timer = null;
      }, 150);
    },
    toPlaylist(params) {
      // this.$router.push({path: `/playlist/${params.id}`, query: {q: JSON.stringify(params)}});
      // this.$router.push({name: `playlist`, params});
      this.$router.push(`/playlist/${params.id}`);
      this[types.SET_PLAYLIST_INFO](params);
    }
  },
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .songListItem{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .item{
      width: 33vw;
      position: relative;
      .img{
        width: 100%;
        border-radius: 20px;
      }
      .songDetail{
        @include fc(14px, #000);
        white-space: normal;
        @include omit();
      }
      .playCount{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        @include fc(14px, white);
        padding: 0 6px;
        border-radius: 20px;
        background-color: rgba(0, 0, 0 , .2);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .icon{
          @include wh(26px, 26px);
        }
      }
    }
    .backUp{
      @include wh(100vw, 134px);
      @include fc(24px, #666);
      padding-top: 20px;
      margin: 0 auto;
      text-align: center;
    }
  }
</style>