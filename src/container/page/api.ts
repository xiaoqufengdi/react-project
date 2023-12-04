import { ajax } from '@utils';
import {ajaxDelete, ajaxPost} from '@src/utils/ajax';

interface IApiUrl {
    projectInfo: Record<string, string>
}

/**
 * method getUrl 给地址拼接公共路径前缀
 * @param {string} url 接口地址
 * @return {string} 接口拼接公共路径前缀
 * @author lujianmin  2023-11-30
 */
function getUrl(url: string): string{
    const _proxyUrl = '/newProxyApi';
    return `${_proxyUrl}${url}`;
}


export const apiUrl: IApiUrl = {
    projectInfo: { // 项目相关的接口地址
        createType: getUrl('/ingress/searchengine/api/config/class/create'), // 创建分类
        queryTypeAll: getUrl('/ingress/searchengine/api/config/class/listAll'), // 所有分类、项目查询
        updateType: getUrl('/ingress/searchengine/api/config/class/update'),  // 分类更新
        deleteType: getUrl('/ingress/searchengine/api/config/class/delete'), // 删除分类
        changeIndexType: getUrl('/ingress/searchengine/api/config/class/change'), // 改变分类
        createIndex: getUrl('/ingress/searchengine/api/config/index/create'), // 创建索引集合
        deleteIndex: getUrl('/ingress/searchengine/api/config/index/delete'), // 删除索引集合
        detailIndex: getUrl('/ingress/searchengine/api/config/index/detail'),  // 索引集合详情
        bindDataSource: getUrl('/ingress/searchengine/api/config/index/bind'), // 绑定数据源
        queryModelList: getUrl('/ideserver/api/v1/data/modelList'),  // 数据源接口-查询已经创建的模型实例
        collectionDetail: getUrl('/ingress/dataservice/api/model/collection/detail'),  // 数据源接口-查询表的字段详情

        search: getUrl('/ingress/searchengine/api/search'), // 搜索接口

        queryDictionary: getUrl('/ingress/searchengine/api/config/dict/list'),   // 字典查询接口
        connectDictionary: getUrl('/ingress/searchengine/api/config/dict/apply'), // 字典关联接口
        queryDictionaryByIndex: getUrl('/ingress/searchengine/api/config/dict/index/query'), // 查询索引集合关联字典
        updateDictionaryByIndex: getUrl('/ingress/searchengine/api/config/dict/apply/update'), // 查询索引集合关联字典

        queryLog: getUrl('/ingress/searchengine/api/task/query'),

    }

    // 其他模块...
}

// appget
// export const appGet = async (data: unknown): Promise<{ errcode: number; msg: string; data: unknown }> => {
//   return await ajax.ajaxPost({ url: '/proxyApi/get', data });
// };

type FunctionType = <T>(data: Record<string, unknown>) => Promise<T>;

interface IRequest{
    projectInfo: Record<string, FunctionType>

}
// 统一的请求封装
const request: IRequest = {
    projectInfo: { // 项目相关接口
        createType: (data: Record<string, unknown>)=> ajax.ajaxPost({url: apiUrl.projectInfo.createType, data}),
        queryTypeAll: (data: Record<string, unknown>)=> ajax.ajaxGet({url: apiUrl.projectInfo.queryTypeAll, queryParams: data }),
        updateType: (data: Record<string, unknown>)=> ajax.ajaxPost({url: apiUrl.projectInfo.updateType, data}),
        deleteType: (data: Record<string, unknown>)=> ajax.ajaxDelete({url: apiUrl.projectInfo.deleteType, data }),
        changeIndexType: (data: Record<string, unknown>)=> ajax.ajaxPost({url: apiUrl.projectInfo.changeIndexType, data}),
        createIndex: (data: Record<string,unknown>) => ajax.ajaxPost({url: apiUrl.projectInfo.createIndex, data}),
        deleteIndex: (data: Record<string,unknown>) => ajax.ajaxDelete({url: apiUrl.projectInfo.deleteIndex, data}),
        detailIndex: (data: Record<string,unknown>) => ajax.ajaxGet({url: apiUrl.projectInfo.detailIndex, queryParams: data}),
        bindDataSource: (data: Record<string, unknown>)=> ajax.ajaxPost({url: apiUrl.projectInfo.bindDataSource, data}),
        queryModelList: (data: Record<string, unknown>)=> ajax.ajaxPost({url: apiUrl.projectInfo.queryModelList, data}),
        collectionDetail: (data: Record<string, unknown>)=> ajax.ajaxGet({url: apiUrl.projectInfo.collectionDetail, queryParams: data}),

        search: (data: Record<string, unknown>)=> ajax.ajaxPost({url: apiUrl.projectInfo.search,  data}),
        queryDictionary: (data: Record<string, unknown>)=> ajax.ajaxGet({url: apiUrl.projectInfo.queryDictionary, queryParams: data}),
        connectDictionary: (data: Record<string, unknown>)=> ajax.ajaxPost({url: apiUrl.projectInfo.connectDictionary, data}),
        queryDictionaryByIndex: (data: Record<string, unknown>)=> ajax.ajaxGet({url: apiUrl.projectInfo.queryDictionaryByIndex, queryParams: data}),
        updateDictionaryByIndex: (data: Record<string, unknown>)=> ajax.ajaxPost({url: apiUrl.projectInfo.updateDictionaryByIndex, data}),

        queryLog: (data: Record<string, unknown>) => ajax.ajaxPost({url: apiUrl.projectInfo.queryLog, data}),
    }

    // 其他模块...

}

export default request;