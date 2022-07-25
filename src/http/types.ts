import { AxiosResponse } from 'axios';

export type { AxiosRequestConfig, AxiosResponse, AxiosInstance, Method } from 'axios';

export type JsonData = Record<string, unknown>;
export type RequestData = JsonData | FormData;
export type ResponseData = JsonData;

export interface Response extends AxiosResponse {
  code: number;
  message?: string;
  data: any;
}