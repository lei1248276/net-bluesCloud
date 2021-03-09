import axios from 'axios';


/*
* 节流
*/
export function throttle(cb, wait) {
  let oldTime = 0;
  return function () {
    let now = Date.now();
    if (now - oldTime > wait) {
      cb.call(this);
      oldTime = now;
      console.log(`执行`);
    }
  }
}

/*
* 防抖
*/
export function debounce(cb, delay = 500) {
  let timer;
  return function (...arg) {
    let callNow = !timer;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
    }, delay);
    if (callNow) {
      cb.call(this, ...arg);
    }
  }
}


/*
* 请求中断
*/
const CancelToken = axios.CancelToken,
    map = new Map();
export const net = {
  addReq(url) {
    new CancelToken(function (c) {
      if (!map.has(url)) {
        map.set(url, c);
      }
    });
  },
  removeReq(url) {
    if (map.has(url)) {
      let cancel = map.get(url);
      cancel(url);
      map.delete(url);
    }
  }
}