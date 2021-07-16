<template>
  <div class="load-wait">
    <img src="@/assets/img/loadWait/rage_loading.png" alt="loading" class="loading">
    <p>正在加载中</p>
  </div>
</template>

<script>
export default {
  name: "LoadWait"
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .load-wait{
    position: absolute;
    top: 50%;
    left: 50%;
    @include speed(-50%, -50%);
    text-align: center;
    font-size: 22px;
    .loading{
      animation: rotating 4s linear infinite;
    }
  }

  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>