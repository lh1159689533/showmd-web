import axios from './axios';
import * as apis from '../api';
import { JsonData, RequestData, AxiosRequestConfig, Method, Response } from './types';

export * from './types';

const services = new Map<string, string>();
Object.values(apis).map(api => {
  Object.entries(api).map(([k, v]) => {
    services.set(`${api.namespace}/${k}`, v);
  });
});

// type JsonData = Record<string, string | number | boolean>;

interface RequestProps {
  apiurl: string;
  prefix?: string;
  headers?: any;
  data?: RequestData;
  segment?: JsonData;
  params?: JsonData;
}

function request(props: RequestProps): Promise<[Error, Response]> {
  const { apiurl, data, params, headers, segment, prefix } = props;
  let [method, url] = services.get(apiurl)?.split(' ') || [];

  if (segment) {
    url = url.replace(/:(\w+)/g, (_: string, $1: string) => segment[$1].toString());
  }

  if (prefix) {
    url = prefix + url;
  }

  const config: AxiosRequestConfig = {
    url,
    method: (method as Method)
  };

  if (method === 'get') {
    config.params = data;
  } else {
    config.data = data;
  }

  if (params) {
    config.params = params;
  }

  if (headers) {
    config.headers = headers;
  }

  return new Promise<[Error | null, Response | null]>(resolve => {
    axios(config).then((result: Response) => {
      resolve([null, result]);
    }).catch((err) => {
      resolve([err, null]);
    });
  });
}

export default {
  request
};
