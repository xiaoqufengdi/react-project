declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.svg';
declare module '*.less';

declare module 'ancillarySystem/interface' {
  interface ifsConditionInfo {
    conditionType: string;
    attributeCascaderValue?: string[];
    conditionSymbol?: string;
    values?: {
      key: string;
      value: unknown;
    };
    valueType?: string;
    attrType?: string;
  }

  // 视图--排序条件
  interface ifsDataSourceViewOrder {
    fieldId: string;
    sort: string;
  }

  // 全局视图
  interface ifsDataSourceViewGlobal {
    operateInfo?: string[]; // 'query', 'create', 'update', 'delete'
    selectFields?: string[];
    condition?: ifsConditionListInfo;
    order?: ifsDataSourceViewOrder;
    secondaryOrder?: ifsDataSourceViewOrder[];
  }
  // 权限视图
  interface ifsDataSourceViewUser {
    id: string;
    label: string;
    /* permission?: {
      // 用户范围
      [key: 'string']: string[];
    }; */
    permission?: ifsConditionItemInfo[]; // 用户范围
    operateInfo?: string[];
    selectFields?: string[];
    condition?: ifsConditionListInfo;
    order?: ifsDataSourceViewOrder;
    secondaryOrder?: ifsDataSourceViewOrder[];
  }

  // 转换字段
  interface ifsDataSourceTransformField {
    id: string;
    isSort: boolean;
    key: string;
    name: string;
    pKey: string;
    pid: string;
    formula: { title: string; type: string; value: string }[];
    formulaStr: string;
  }

  // 数据源字段关联关系
  interface ifsDataSourceRelationField {
    id: string;
    name: string;
    idWidget: string;
    isArr: boolean;
    iconUrl: string;
    relationAttr: string; // 关联元素属性
    relationInfo: {
      fieldId: string;
      transformId: string;
    };
    valueType?: string;
    defaultValue?: string;
    type?: 'input' | 'output' | 'inputAndOutput' | ''; // inputAndOutput-双向绑定  input-元素到字段  output-字段到元素
  }

  // 筛选条件数据类型
  type ifsConditionListInfo = Array<ifsConditionItemInfo[]>;

  // 流程 / 权限视图筛选条件
  interface ifsConditionItemInfo {
    fieldId?: string; // 字段id
    fieldIdName?: string; // 表字段的名称
    fieldAttribute?: string; // 字段属性
    fieldValueType?: string; // 字段值类型
    conditionSymbol?: string; // 条件符号 = < > 等
    settingType?: string; // 设置的值类型 fixed固定值 relation关联控件 variable 变量
    values?: unknown; // 值
    relationWidgetAttr?: string; // 关联控件属性
  }

  /**
   * 业务模型
   */

  // 业务模型信息
  interface ifsDataserviceModelInfo {
    app_id: string;
    id: number;
    instance_id: string;
    instance_name: string;
    model_id: string;
    describe: string;
    create_time: string;
    update_time: string;
    collection_list: ifsModelCollectionInfo[];
  }
  // 业务模型表详情
  interface ifsModelCollectionInfo {
    collection_id: string;
    collection_name: string;
    collection_title: string;
    schema_name: string;
    instance_id: string;
    model_id: string;
    version_id: string;
    describe: string;
    create_time: string;
    update_time: string;
    id: number;
    widgets: {
      actionInfo: unknown[];
      widgetCombinationList: unknown[];
      widgetInfoList: unknown[];
    };
    field_list: ifsModelCollectionField[];
  }
  // 业务模型表字段信息
  interface ifsModelCollectionField {
    field_name: string;
    field_type: string;
    widget_info: unknown;
    level: string; // U0 PSAU
    describe?: string;
    validator_type?: string; // regexp / func
    validator_regexp?: string; // 验证类型为regexp时此字段有值
    validator_func_name?: string; // 验证类型为func时此字段有值
    validator_namespace?: string; // 验证类型为func时此字段有值
    validator_message?: string; // 验证失败消息
    isSelected?: boolean;
  }
  // 数据视图数据
  interface ifsModelViewInfo {
    app_id: string;
    view_id: string;
    view_name: string;
    instance_id: string;
    collection_id: string;
    data_id: string;
    config: ifsDataSourceViewGlobal;
    user_config: ifsDataSourceViewUser[];
    relation_fields: ifsDataSourceRelationField[];
    field_list: ifsModelCollectionField[];
    transform_fields: ifsDataSourceTransformField[];
    view_config?: Record<string, unknown>;
  }

  // IDE业务模型
  interface ifsIDEDataModelInfo {
    id: string;
    class: string;
    title: string;
    list: ifsIDEDataModelListInfo[];
    remark: string;
    total: number; //数据量
    create_time: string;
    creator: string;
    update_time: string;
    updator: string;
  }
  // 模型-表信息
  interface ifsIDEDataModelListInfo {
    data_model_id: string;
    data_model_name: string;
    data_model_title: string;
    data_model_type: string; // model类型：etl, dict,
    to_path: string; // 跳转地址
    pid: string;
    remark: string;
    total: number; //数据量
    create_time: string;
    creator: string;
    update_time: string;
    updator: string;
  }

  // IDE分类
  interface ifsIDEClassifyInfo {
    type: number; // 0 目录; 1 功能
    id: string;
    name: string;
    remark: string;
    parentId: string;
    key?: string;
    isSystem?: boolean; // 系统分类不可更改
    children?: ifsIDEClassifyInfo[] | null;
  }
}
