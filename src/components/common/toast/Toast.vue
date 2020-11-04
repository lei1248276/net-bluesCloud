<template>
  <transition name="toast_animation">
    <div id="toast" v-show="isShow">
      {{message}}
    </div>
  </transition>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {
      message: '',
      isShow: false
    }
  },
  methods: {
    show(content, duration = 1000) {
      this.message = content;
      this.isShow = true;
      setTimeout(() => {
        this.isShow = false;
      }, duration);
    }
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  #toast{
    @include speed();
    z-index: 1111;
    width: 220px;
    padding: 0 20px;
    height: 150px;
    line-height: 150px;
    @include center();
    @include fc(20px, #fff);
    text-align: center;
    background-color: rgba(0, 0, 0, .3);
    border-radius: 20px;
  }

  .toast_animation-enter-active {
    transition: all .3s ease;
  }
  .toast_animation-leave-active {
    transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .toast_animation-enter, .toast_animation-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>