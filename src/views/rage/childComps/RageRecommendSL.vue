<template>
  <div class="recommendSL" v-if="Object.keys(this.recommendSL).length > 0">
    <recommend-title :title="'推荐歌单'" :path="'/songList'"></recommend-title>
    <song-list-item :data="recommendSL" :col="3"></song-list-item>
  </div>
</template>

<script>
import RecommendTitle from "@/components/content/recommendTitle/RecommendTitle";
import SongListItem from "@/components/content/songListItem/SongListItem";

export default {
  name: "RageRecommendSL",
  components: {
    RecommendTitle,
    SongListItem
  },
  props: {
    recommendSL: {
      type: Array,
      default() {
        return []
      }
    }
  },
}
</script>

<style scoped>
</style>