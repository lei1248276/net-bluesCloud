<template>
  <div class="highlight" ref="highlight">
  </div>
</template>

<script>
export default {
  name: "HighLight",
  data() {
    return {
      currentIndex: 0,
      v: 0
    }
  },
  watch: {
    currentIndex(value, oldValue) {
      if (value > oldValue) {
        this.v = this.v + (value - oldValue);
      } else {
        this.v = this.v - (oldValue - value);
      }
      this.$refs.highlight.style.transform = `translateX(${this.v * 100}%)`;
    }
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .highlight{
    @include wh(25%, 2px);
    background-color: $active;
    position: absolute;
    bottom: 0;
    transform: translateX(0);
    transition: transform .5s;
  }
</style>