<template>
  <div class="recommendMV" v-if="Object.keys(this.recommendMV).length > 0">
    <recommend-title :title="'推荐MV'" :path="'/songList'"
                     :img-url="require('@/assets/img/rage/aee.png')">
    </recommend-title>
    <song-list-item :data="recommendMV" @isLoadedImg="isLoadedImg"></song-list-item>
  </div>
</template>

<script>
import RecommendTitle from "@/components/content/recommendTitle/RecommendTitle";
import SongListItem from "@/components/content/songListItem/SongListItem";

export default {
  name: "RageRecommendMV",
  props: {
    recommendMV: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    RecommendTitle,
    SongListItem
  },
  methods: {
    isLoadedImg() {
      this.$emit('onRefresh');
    }
  }
}
</script>

<style scoped>

</style>