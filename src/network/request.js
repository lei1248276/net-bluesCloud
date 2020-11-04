import axios from 'axios';

const _baseUrl = 'http://api.javaswing.cn';
const _baseUrl2 = 'https://api.imjad.cn/cloudmusic/';

export default function request(config) {
  const instance = axios.create({
    baseURL: _baseUrl,
    timeout: 5000,
  });

  instance.interceptors.response.use(res => {
    // 百度云请求超时检测
    if (res.status === 654) {
      alert('请求超时！')
    }
    return res.data
  }, error => {
    console.log(error);
  })

  return instance(config);
}