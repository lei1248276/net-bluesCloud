import axios from 'axios';
import {net} from '@/common/util'

// const _baseUrl = 'http://api.javaswing.cn';
const _baseUrl = 'https://api.mtnhao.com';

export default function request(config) {
  const instance = axios.create({
    baseURL: _baseUrl,
    timeout: 5000,
  });

  instance.interceptors.request.use(req => {
    net.removeReq(config.url);
    net.addReq(config.url);
    return req;
  })

  instance.interceptors.response.use(res => {
    net.removeReq(config.url);

    return res.data
  }, error => {
    console.log(error);
  })

  return instance(config);
}