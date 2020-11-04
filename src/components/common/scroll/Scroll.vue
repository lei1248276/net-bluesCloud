<template>
  <div class="wrapper" ref="wrapper" :style="{'white-space': scrollX ? 'nowrap' : 'normal'}">
    <div class="box" :style="{'display': scrollX ? 'inline-block' : 'block'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core';

import PullUp from '@better-scroll/pull-up'
BScroll.use(PullUp);

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    scrollX: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      pullUpLoad: true,
      probeType: this.probeType,
      scrollX: this.scrollX
    });

    this.$emit('start');
  },
  methods: {
    on(event, cb) {
      this.scroll.on(event, cb);
    },
    off(event, cb) {
      this.scroll.off(event, cb);
    },
    refresh() {
      this.scroll.refresh();
    },
    finishPullUp() {
      this.scroll.finishPullUp();
    },


    handleScroll(position) {
      this.$emit('scroll', position.y);
    },
    handleScrollStart() {
      this.$emit('scrollStart');
    },
    handleScrollEnd() {
      this.$emit('scrollEnd');
    },
    handlePullingUp() {
      this.$emit('pullingUp');
    },
  }
}
</script>

<style scoped lang="scss">
</style>