<template>
  <div class="swiper">
    <div @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
      <slot></slot>
    </div>
    <div class="indicator" v-if="indicator">
      <span class="indi-item" v-for="(item,index) in slideCount" :key="index"
           :class="{active: index === currentIndex-1}"></span>
    </div>
  </div>
</template>

<script>

export default {
  name: "Swiper",
  props: {
    interval: {
      type: Number,
      default: 3000
    },
    animDuration: {
      type: Number,
      default: 300
    },
    moveRatio: {
      type: Number,
      default: 0.25
    },
    indicator: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      distance: 0,
      slideCount: 0,// 元素的个数
      totalWidth: 0, // swiper的宽度
      swiperStyle: null,// swiper的样式
      currentIndex: 1, // 当前的index
    }
  },
  mounted() {
    setTimeout(() => {
      try {
        this.handleDom();
        this.timerStart();
      } catch (e) {
        location.reload();
      }
    }, 300);
  },
  methods: {
    // 操作DOM
    handleDom() {
        let swiperEl = document.querySelector('.swiper-item');
        let slidesEls = swiperEl.querySelectorAll('.slide');

        // 保存元素的个数
        this.slideCount = slidesEls.length;

        // 3.如果大于1个, 那么在前后分别添加一个slide
        if (this.slideCount > 1) {
          let cloneFirst = slidesEls[0].cloneNode(true);
          let cloneLast = slidesEls[this.slideCount - 1].cloneNode(true);
          swiperEl.insertBefore(cloneLast, slidesEls[0]);
          swiperEl.appendChild(cloneFirst);
          // 保存swiper宽度
          this.totalWidth = swiperEl.offsetWidth;
          // 保存swiper的样式
          this.swiperStyle = swiperEl.style;
        }

        // 4.让swiper元素, 显示第一个(目前是显示前面添加的最后一个元素)
        this.setTransform(-this.totalWidth);

    },

    // 定时器开始
    timerStart() {
      this.playTimer = window.setInterval(() => {
        this.currentIndex++;
        this.scrollContent(-this.currentIndex * this.totalWidth);
      }, this.interval)
    },
    timerEnd() {
      window.clearInterval(this.playTimer);
    },

    // 滑动内容
    scrollContent(currentPosition) {
      this.swiperStyle.transition ='transform '+ this.animDuration + 'ms';
      this.setTransform(currentPosition);

      // 3.判断滚动到的位置
      this.scrollAdjust();
    },
    // 滑动动画
    setTransform(position) {
      this.swiperStyle.transform = `translate3d(${position}px, 0, 0)`;
    },
    // 滑动校准
    scrollAdjust() {
      setTimeout(() => {
        // 1.校验正确的位置
        this.swiperStyle.transition = '0ms';
        if (this.currentIndex >= this.slideCount + 1) {
          this.currentIndex = 1;
          this.setTransform(-this.currentIndex * this.totalWidth);
        } else if (this.currentIndex <= 0){
          this.currentIndex = this.slideCount;
          this.setTransform(-this.currentIndex * this.totalWidth);
        }
      }, this.animDuration)
    },

    // 触摸开始
    onTouchStart(e) {
      // 1.关闭定时器
      this.timerEnd();

      // 2.保存开始滚动的位置
      this.startX = e.touches[0].pageX;
    },
    // 触摸滑动
    onTouchMove(e) {
      // 1.计算出用户拖动的距离
      this.currentX = e.touches[0].pageX;
      this.distance = this.currentX - this.startX;
      let currentPosition = -this.currentIndex * this.totalWidth;
      let moveDistance = this.distance + currentPosition;

      // 2.设置当前的位置
      this.setTransform(moveDistance);
    },
    // 触摸结束
    onTouchEnd(e) {
      // 1.获取移动的距离
      let currentMove = Math.abs(this.distance);

      // 2.判断最终的距离
      if (this.distance === 0){
        return;
      } else if (this.distance > 0 && currentMove > this.totalWidth * this.moveRatio){
        this.currentIndex--;
      } else if (this.distance < 0 && currentMove > this.totalWidth * this.moveRatio){
        this.currentIndex++;
      }
      // 3.移动到正确的位置
      this.scrollContent(-this.currentIndex * this.totalWidth);

      // 4.移动完成后重新开启定时器
      this.timerStart();
    },
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .swiper{
    @include speed();
    position: relative;
    .indicator{
      width: 100%;
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 10px;

      .indi-item{
        @include wh(8px, 8px);
        @include font(12px, 8px);
        background-color: rgba(0, 0, 0, .2);
        border-radius: 4px;
        margin: 0 5px;
      }

      .active{
        background-color: $bc;
      }
    }
  }
</style>