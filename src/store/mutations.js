import types from "@/store/mutation-types";

export default {
  /* * * * * * * * * * * * 路由跳转到playlist时数据 * * * * * * * * * * * */
  // 设置当前页面歌单信息
  [types.SET_PLAYLIST_INFO](state, payload) {
    state.playlistInfo = payload;
  },

  /* * * * * * * * * * * * * * * * * * player * * * * * * * * * * * * * * * * * */
  // player是否显示
  [types.SET_IS_SHOW](state) {
    state.isShow = true;
  },
  // 设置播放
  [types.SET_PLAY](state, payload) {
    state.isPlay = payload;
    if (payload) {
      state.audio.play();
    } else {
      state.audio.pause();
    }
  },
  // 设置当前播放列表歌曲ID
  setCurrentPlayID(state, payload) {
    state.currentPlayID = payload;
  },
  // 设置当前播放列表歌曲index
  [types.SET_CURRENT_PLAY_INDEX](state, payload) {
    state.currentPlayIndex = payload;
    state.currentPlayID = state.playerList[payload].id;
  },
  // 添加歌曲
  [types.ADD_SONG](state, payload) {
    state.playerList.unshift(...payload);
  },
  // 删除歌曲
  [types.DELETE_SONG](state, payload) {
    state.playerList.splice(payload, 1);
    if (state.playerList.length < 1) {
      state.currentPlayID = null;
    }
  },
  // 删除全部歌曲
  [types.DELETE_ALL](state) {
    state.playerList = [];
    state.currentPlayID = null;
  },
  // 点击上一首
  [types.SET_PRE_SONG](state) {
    // 当前播放为第一首时（默认循环播放）
    if (state.currentPlayIndex === 0) {
      this.commit(types.SET_CURRENT_PLAY_INDEX, state.playerList.length - 1);
    } else {
      this.commit(types.SET_CURRENT_PLAY_INDEX, state.currentPlayIndex - 1);
    }
    this.commit(types.SET_PLAY, true);
    this.dispatch('getSong', state.playerList[state.currentPlayIndex].id);
  },
  // 点击下一首
  [types.SET_NEXT_SONG](state) {
    // 当前播放为最后一首时（默认循环播放）
    if (state.currentPlayIndex === state.playerList.length - 1) {
      this.commit(types.SET_CURRENT_PLAY_INDEX, 0);
    } else {
      this.commit(types.SET_CURRENT_PLAY_INDEX, state.currentPlayIndex + 1);
    }
    this.commit(types.SET_PLAY, true);
    this.dispatch('getSong', state.playerList[state.currentPlayIndex].id);
  },
  // 设置当前播放列表歌曲请求URL和Lrc
  [types.SET_CURRENT_PLAY_URL](state, payload) {
    state.currentPlayUrl = payload[0];
    state.currentPlayLrc = payload[1];
  },
  // 设置当前播放列表歌曲缓存url和lrc（做缓存处理）
  [types.SET_CACHE_URL](state, payload) {
    state.playerList[state.currentPlayIndex].songUrl = payload[0];
    state.playerList[state.currentPlayIndex].songLrc = payload[1];
  },
  // 设置player播放模式
  [types.SET_PLAY_MODE](state, payload) {
    state.playMode = payload;
  },

  /* * * * * * * * * * * * * * * * * * audio * * * * * * * * * * * * * * * * * */
  // 设置进度条当前时间
  [types.SET_PROGRESS_TIME](state, payload) {
    state.progressTime = payload;
    // 设置进度条移动距离
    state.progressMove = (payload * state.progressRate).toFixed(3);
  },
  // 设置进度条更新速度频率
  [types.SET_PROGRESS_RATE](state, payload) {
    state.progressRate = payload;
  },
  // 设置歌曲总时长
  [types.SET_DURATION](state, payload) {
    state.duration = payload;
  },
  // 设置播放器
  [types.SET_AUDIO](state, payload) {
    state.audio = payload;
  },

  /* * * * * * * * * * * * * * * * * * songs * * * * * * * * * * * * * * * * * */
  // 设置添加收藏歌曲
  [types.ADD_COLLECT](state, payload) {
    state.collectSongs.unshift(...payload);
    localStorage.setItem('collectSongs', JSON.stringify(state.collectSongs));
  },
  // 设置删除收藏歌曲
  [types.DELETE_COLLECT](state, payload) {
    if (typeof payload !== 'boolean') {
      state.collectSongs.splice(payload, 1);
      localStorage.removeItem('collectSongs');
      localStorage.setItem('collectSongs', JSON.stringify(state.collectSongs));
    } else {
      state.collectSongs = [];
      localStorage.removeItem('collectSongs');
    }
  },
  // 设置添加收藏歌单
  [types.ADD_COL_SONG_LIST](state, payload) {
    state.colSongList.unshift(...payload);
    localStorage.setItem('colSongList', JSON.stringify(state.colSongList));
  },
  // 设置删除收藏歌单
  [types.DEL_COL_SONG_LIST](state, payload) {
    if (typeof payload !== 'boolean') {
      state.colSongList.splice(payload, 1);
      localStorage.removeItem('colSongList');
      localStorage.setItem('colSongList', JSON.stringify(state.colSongList));
    } else {
      state.colSongList = [];
      localStorage.removeItem('colSongList');
    }
  }
}