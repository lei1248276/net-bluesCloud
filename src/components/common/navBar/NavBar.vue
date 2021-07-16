<template>
  <div class="nav-bar">
    <img src="@/assets/img/navBar/logo.png" alt="logo" class="logo">
    <img src="@/assets/img/icon/search.png" alt="search" class="search">
  </div>
</template>

<script>
export default {
  name: "Nav-Bar",
}
</script>

<style scoped lang="scss">
  @import "src/assets/css/base";
  .nav-bar{
    position: fixed;
    z-index: 10;
    @include wh(100%, 56px);
    background-image: linear-gradient( 135deg, #81FFEF 10%, #F067B4 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .logo{
      @include wh(135px, 35px);
    }
    .search{
      padding: 5px;
    }
    .search:active{
      @include active();
    }
  }
</style>