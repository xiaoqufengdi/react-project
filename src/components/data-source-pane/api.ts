import { ajax } from '@utils';
import { ifsIDEDataModelInfo, ifsModelCollectionInfo, ifsIDEClassifyInfo } from 'ancillarySystem/interface';

// 查询业务模型表详情
export const dataserviceCollectionDetail = async (id: string): Promise<ifsModelCollectionInfo> => {
  return await ajax.ajaxGet({ url: '/newProxyApi/ingress/dataservice/api/model/collection/detail', queryParams: { collection_id: id } });
};

// 模型列表
export const ideDataModelList = async (data: {
  class?: string;
  app_id?: string;
  title?: string;
  page?: number;
  page_size?: number;
  sort?: { sort: string; field: string }[];
}): Promise<{ errcode: number; msg: string; data: { list: ifsIDEDataModelInfo[]; total: number } }> => {
  return await ajax.ajaxPost({
    url: '/newProxyApi/ingress/ideserver/api/v1/data/modelList',
    data: {
      ...data,
      app_id: data.app_id ?? localStorage.getItem('app_id') ?? '3e8bef1c-a8f1-4997-9a29-6fadb5138c01',
    },
  });
};

// 数据模型分类列表
export const ideDataClassList = async (app_id?: string): Promise<{ errcode: number; msg: string; data: ifsIDEClassifyInfo[] }> => {
  return await ajax.ajaxPost({
    url: '/newProxyApi/ingress/ideserver/api/v1/data/classList',
    data: {
      app_id: app_id ?? localStorage.getItem('app_id') ?? '3e8bef1c-a8f1-4997-9a29-6fadb5138c01',
    },
  });
};
