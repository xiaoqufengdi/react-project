import axios from 'axios';

const TIME_OUT = 1000 * 30;

const config = {
  timeout: TIME_OUT, // 请求超时时间
  // baseURL: BASEURL,
};

// 创建axios实例
const instance = axios.create(config);

// request 拦截器
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response 拦截器
instance.interceptors.response.use(
  (response) => {
    const msg = _.get(response, 'data.msg');
    const errcode = _.get(response, 'data.errcode');
    if (errcode === 1 && typeof msg === 'string' && msg !== '') {
      return Promise.reject(response);
    }
    return Promise.resolve(response);
  },
  //接口错误状态处理，也就是说无响应时的处理
  (error) => {
    // 返回接口返回的错误信息
    return Promise.reject(error.response);
  }
);

export const ajaxGet = <T>(params: { url: string; queryParams?: unknown }): Promise<T> => {
  const { url, queryParams } = params;
  return instance
    .get(url, {
      ...config,
      params: queryParams,
      headers: { 'VERSION': '3.0', 'Content-Type': 'application/json' },
    })
    .then((res) => {
      if (res && res.data && 'data' in res.data) {
        return res.data.data;
      }
      return res.data;
    });
};

export const ajaxPost = <T>(params: { url: string; data?: unknown }): Promise<T> => {
  const { url, data = {} } = params;
  return instance
    .post(url, data, {
      ...config,
      headers: { 'VERSION': '3.0', 'Content-Type': 'application/json' },
    })
    .then((res) => res.data);
};

export const ajaxUpload = <T>(params: { url: string; data?: unknown; headers?: Record<string, unknown> }): Promise<T> => {
  const { url, data = {} } = params;
  return instance
    .post(url, data, {
      ...config,
      headers: { 'VERSION': '3.0', 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};

// Record<string, string>
export const ajaxDelete = <T>(params: { url: string; data?: unknown }): Promise<T> => {
  const { url, data = {} } = params;
  let URL = url;
  if (data) {
    const key = Object.keys(data)[0];
    URL = URL + `?${key}=${data[key]}`;
  }
  return instance
    .delete(URL, {
      ...config,
    })
    .then((res) => res.data);
};
