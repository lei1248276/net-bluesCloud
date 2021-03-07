import request from "@/network/request";

/*
* 获取歌单详情
*/
export function getPlaylistDetail(id) {
  return request({
    url: `/playlist/detail?id=${id}`
  })
}

/*
* 获取歌单全部歌曲详情
*/
export function getPlaylistSongDetail(id) {
  return request({
    url: `/song/detail?ids=${id}`
  })
}

/*
* 获取歌词
*/
export function getLyric(id) {
  return request({
    url: `/lyric?id=${id}`
  })
}

/*
* 获取播放歌曲url
*/
export function getSongUrl(id) {
  return request({
    url: `/song/url?id=${id}`
  })
}