import axios from 'axios';
import router from "../router";
import auth from '@utils/auth';

import { AxiosResponse, AxiosInstance, AxiosRequestConfig, Response } from './types';

let PREFIX = "/api";
if (process.env.NODE_ENV === "development") {
  PREFIX = "/api";
  // IP = "http://localhost:3000";
}

// 创建axios实例
const instance: AxiosInstance = axios.create({
  timeout: 50000,
});

// request拦截器
instance.interceptors.request.use(
  (config: any) => {
    config.url = `${PREFIX}/${config.url}`;
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error);
    Promise.reject(error);
  }
);

// respone拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<Response, AxiosRequestConfig>) => {
    if (response.status === 200) {
      let resp: Response = response.data;
      if (resp.code === 401 && auth(router.currentRoute.value.path)) {
        router.push('/blog');
        return;
      }
      if (resp instanceof Blob) {
        return response;
      }
      const contentType = response.headers['content-type'];
      if (contentType && contentType.indexOf('application/json') !== -1 && typeof resp === 'string') {
        resp = JSON.parse(resp);
      }
      return resp;
    } else {
      return Promise.reject("error:" + response.status);
    }
  },
  (e) => {
    console.log("err:" + e.message);
    return Promise.reject(e);
  }
);

export default instance;
