import { ifsIDEDataModelInfo } from 'ancillarySystem/interface';

/**
 * 获取数据表图标路径
 * @param sourceType: form数据表  flow流程  tree树形表  factory数据工厂 dict字典表
 * @returns
 */
export const handleDataSourceIconUrlGet = (sourceType?: string): string => {
  switch (sourceType) {
    case 'form':
      return '/fileServer/icons/ant-design-icons/ai-outline-database.svg';
    case 'flow':
      return '/fileServer/icons/ant-design-icons/ai-outline-apartment.svg';
    case 'tree':
      return '/fileServer/icons/vs-code-icons/vsc-list-tree.svg';
    case 'factory':
      return '/fileServer/icons/ant-design-icons/ai-outline-hdd.svg';
    case 'dict':
      return '/fileServer/icons/ant-design-icons/ai-outline-ordered-list.svg';
    case 'tree-node':
      return '/fileServer/icons/vs-code-icons/vsc-list-tree.svg';
    /* case 'user':
      return '/fileServer/icons/box-icons/bi-user-circle.svg';
    case 'role':
      return '/fileServer/icons/ant-design-icons/ai-outline-trademark-circle.svg';
    case 'org':
      return '/fileServer/icons/ant-design-icons/ai-outline-partition.svg'; */
    case 'model':
      return '/fileServer/icons/ant-design-icons/ai-outline-group.svg';
    // 新的 data_model_type
    case 'data-table':
      return '/fileServer/icons/ant-design-icons/ai-outline-database.svg';
    case 'tree-table':
      return '/fileServer/icons/vs-code-icons/vsc-list-tree.svg';
    case 'etl':
      return '/fileServer/icons/ant-design-icons/ai-outline-hdd.svg';
    case 'dict-table':
      return '/fileServer/icons/ant-design-icons/ai-outline-ordered-list.svg';
    default:
  }
  return '/fileServer/icons/ant-design-icons/ai-outline-database.svg';
};

// 模型内表信息提取
export const handleModelInfoToList = (
  data: ifsIDEDataModelInfo[]
): {
  id: string;
  name: string;
  type: string;
}[] => {
  const list: {
    id: string;
    name: string;
    type: string;
  }[] = [];
  data.forEach((item) => {
    if (item.id && item.list) {
      item.list.forEach((f) => {
        list.push({
          id: f.data_model_id,
          name: f.data_model_title,
          type: f.data_model_type || f.data_model_name,
        });
      });
    }
  });
  return list;
};
