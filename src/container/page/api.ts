import { ajax } from '@utils';

// appget
export const appGet = async (data: unknown): Promise<{ errcode: number; msg: string; data: unknown }> => {
  return await ajax.ajaxPost({ url: '/proxyApi/get', data });
};
