<template>
  <div class="tab-control">
    <div v-for="(items, index) in title" :key="index"
         class="tab" @click="onItemClick(index)"
         :class="{active: index === currentIndex}">
      <span>{{ items }}</span>
    </div>
    <high-light ref="highlight"></high-light>
  </div>
</template>

<script>
import HighLight from "@/components/common/highlight/HighLight";

export default {
  name: "Tab-Control",
  props: {
    title: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    HighLight
  },
  data() {
    return {
      currentIndex: 0,
      index: 0
    }
  },
  methods: {
    onItemClick(item) {
      this.currentIndex = item;
      this.$emit('tabClick', this.currentIndex);
    }
  },
  watch: {
    currentIndex() {
      this.$refs.highlight.currentIndex = this.currentIndex;
    }
  },
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .tab-control{
    position: fixed;
    z-index: 10;
    top: 56px;
    @include wh(100%, 46px);
    @include font(14px, 46px);
    color: $color;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    text-align: center;

    .tab{
      flex: 1;
    }
    .active{
      color: $active;
      background-color: $activeBc;
      transition: all 1s;
    }
  }
</style>