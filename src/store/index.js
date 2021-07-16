import Vue from 'vue';
import Vuex from 'vuex';
import getters from "@/store/getters";
import mutations from "@/store/mutations";
import actions from "@/store/actions";

Vue.use(Vuex);

const state ={
  playlistInfo: {}, // 播放列表信息
  playerList: [],   // 当前播放列表
  currentPlayID: null, // 当前播放音乐查询ID
  currentPlayIndex: 0, // 当前播放列表歌曲所在 index
  currentPlayUrl: '', //  当前播放列表歌曲 url
  currentPlayLrc: '', //  当前播放列表歌曲 lrc
  isPlay: false,  // player是否播放
  isShow: false,  // player是否显示
  playMode: 0, // player播放模式
  progressTime: 0, // 进度条当前时间
  progressRate: 0, // 进度条移动频率
  progressMove: 0, // 进度条移动距离
  duration: 0, // 歌曲总时长
  audio: null, // 播放器
  collectSongs: [], // 收藏歌曲列表
  colSongList: [], // 收藏歌单列表
};

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

export default store;