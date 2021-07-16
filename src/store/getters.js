export default {
  /* * * * * * * * * * * * player * * * * * * * * * * * */
  // 获取player是否显示
  isShowPlayer: state => state.isShow,


  /* * * * * * * * * * * * playerList * * * * * * * * * * * */
  // 获取当前页面歌单信息
  getPlaylistInfo: state => state.playlistInfo,

  // 获取播放列表
  getPlayerList: state => state.playerList,

  // 获取播放列表长度
  getSizePlayer: state => state.playerList.length,

  // 获取播放列表是否为空
  isEmptyPlayer: state => state.playerList.length === 0,

  // 获取播放列表当前播放歌曲ID
  getCurrentPlayID: state => state.currentPlayID,

  // 获取播放列表当前播放歌曲index
  getCurrentPlayIndex: state => state.currentPlayIndex,

  // 获取播放列表当前播放歌曲url
  getCurrentPlayUrl: state => state.currentPlayUrl,

  // 获取播放列表当前播放歌曲lrc
  getCurrentPlayLrc: state => state.currentPlayLrc,

  // 获取缓存歌曲url
  getCacheUrl: state => state.playerList[state.currentPlayIndex].songUrl,

  // 获取缓存歌曲lrc
  getCacheLrc: state => state.playerList[state.currentPlayIndex].songLrc,



  /* * * * * * * * * * * * audio * * * * * * * * * * * */
  // 获取播放器
  getAudio: state => state.audio,

  // 获取播放状态
  getIsPlay: state => state.isPlay,

  // 获取player播放模式
  getPlayMode: state => state.playMode,

  // 获取歌曲总时长
  getDuration: state => state.duration,

  // 获取进度条当前时间
  getProgressTime: state => state.progressTime,

  // 获取进度条进度频率
  getProgressRate: state => state.progressRate,

  // 获取进度条移动距离
  getProgressMove: state => state.progressMove,



  /* * * * * * * * * * * * collect * * * * * * * * * * * */
  // 获取收藏歌曲列表
  getCollectSongs: state => state.collectSongs,

  // 获取收藏歌单列表
  getColSongList: state => state.colSongList,
}