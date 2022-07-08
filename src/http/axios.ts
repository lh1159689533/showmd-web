import axios from 'axios';

import { AxiosResponse, AxiosInstance, AxiosRequestConfig, Response } from './types';

// export type RequestConfig = AxiosRequestConfig;
// export type RequestMethod = Method;
// export type JsonData = Record<string, string | number | boolean>;
// export type RequestData = JsonData | FormData;
// export type ResponseData = JsonData | string | number | boolean;
// export interface Response extends AxiosResponse {
//   code: number;
//   message?: string;
//   data: ResponseData;
// }

let PREFIX = "/api",
  IP = "";
if (process.env.NODE_ENV === "development") {
  PREFIX = "/api";
  IP = "http://localhost:1229";
}

// 创建axios实例
const instance: AxiosInstance = axios.create({
  timeout: 50000,
});

// request拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.url = `${PREFIX}/${config.url}`;
    
    if (config.url?.endsWith(".json")) {
      config.url = IP + config.url.replace("/api", "");
    } else if (config.url?.endsWith("picture/upload")) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'multipart/form-data'
      };
    } else {
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/json;charset=UTF-8'
      };
    }
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
      let data: Response = response.data;
      const contentType = response.headers['content-type'];
      if (contentType && contentType.indexOf('application/json') !== -1 && typeof data === 'string') {
        data = JSON.parse(data);
      }
      return data;
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
