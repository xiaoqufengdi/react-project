import {INode} from '@src/container/page/service-content/project/index';

export interface IData {
    field_name: string;
    relevancy: number;
}

export interface IDetail {
    app_id: string;
    index_name: string; // 索引集合名称
    model_instance_id: string; // 来自数据源接口表详情
    collection_id: string; // 来自数据源接口表详情
    collection_name: string;
    primary_key: string; // 固定为_id
    field_list?: Array<Record<string, unknown>>; // 来自数据源接口表详情
    field_relevancy?: Array<IData>;
    class_id: string;  //所属分类id
    index_id: string; // 索引ID
    status: string;
//  'nodatasource' / 'processing' / 'succeeded', nodatasource状态才可绑定数据源
}

export interface ComponentProps {
    selectedNode: INode | null;
    app_id: string
}

export interface IResult{
    errcode: number;
    msg: string;
    data: any
}

// 节点类型-分类|项目节点
export enum NODE_TYPE {
    CLASS = 'class',
    ITEM = 'item'
}