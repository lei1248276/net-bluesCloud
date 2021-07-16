import request from "@/network/request";

/*
* 获取全部歌单
*/
export function getSongListAll(offset, limit) {
  return request({
    url: `/top/playlist?limit=${limit}&order=all&offset=${offset}`
  })
}