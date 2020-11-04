import request from "@/network/request";

/*
 * 获取首页Banner图片数据
 */
export function getBannerList() {
  return request({
    url: '/banner'
  })
}
/*
 * 获取推荐歌单
 */
export function getPersonalized() {
  return request({
    url: '/personalized'
  })
}
/**
 * 获取推荐 mv
 */
export function getPersonalizedMV() {
  return request({
    url: '/personalized/mv'
  })
}