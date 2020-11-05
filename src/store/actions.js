import {getSongUrl, getLyric} from "@/network/playlist";
import types from "@/store/mutation-types";

export default {
  getSong({commit, state , dispatch}, payload) {
    return new Promise((resolve, reject) => {
      if (state.playerList[state.currentPlayIndex].songUrl == null) {
        const arr = [];
        Promise.all([getSongUrl(payload), getLyric(payload)]).then(res => {
          arr.push(res[0].data[0].url, res[1].lrc.lyric);
          if (arr[0] == null) {
            throw new Error('链接无效');
          } else {
            console.log(`初次请求`);
            // 添加到缓存
            commit(types.SET_CURRENT_PLAY_URL, arr);
            commit(types.SET_CACHE_URL, arr);
            resolve('添加成功');
          }
        }).catch(() => {
          // 只有一首时，换歌出错
          if (state.playerList.length === 1) {
            commit(types.DELETE_SONG, state.currentPlayIndex);
            reject('链接无效请换一首');
          }
          // 只有两首时，换歌出错
          if (state.playerList.length === 2) {
            commit(types.DELETE_SONG, state.currentPlayIndex);
            commit(types.SET_CURRENT_PLAY_INDEX, 0);
            reject('链接无效换上一曲');
          }
          // 大于两首时，换歌出错
          if (state.playerList.length > 2) {
            commit(types.DELETE_SONG, state.currentPlayIndex);
            // 最后一首时
            if (state.currentPlayIndex === state.playerList.length) {
              commit(types.SET_CURRENT_PLAY_INDEX, 0);
            } else {
              commit(types.SET_CURRENT_PLAY_INDEX, state.currentPlayIndex);
            }
            dispatch('getSong', state.playerList[state.currentPlayIndex].id);
            reject('链接无效换下一曲');
          }
        })
      }
    })
  }



  /*getSong({ commit, state }, payload) {
    console.log(payload);
    const arr = [];
    for (let i = 0, { length } = payload; i < length; i++) {
      arr.push(getSongUrl(payload[i].id));
    }
    Promise.all(arr).then(res => {
      console.log(res);
      // 添加歌曲到仓库
      for(let { length } = res, i = length - 1; i >= 0; i--) {
        commit(ADD_SONG, {
          id: payload[i].id,
          name: payload[i].name,
          singer: payload[i].ar[0].name,
          albumPic: payload[i].al.picUrl,
          songUrl: res[i].data[0].url
        });
      }
      // 更新当前播放歌曲
      commit(SET_CURRENT_PLAY_INDEX, 0);
      commit(SET_PLAY, true);
    }).catch(err => {
      console.log('audio请求失败' + err);
    })
  },*/
}