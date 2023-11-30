import { useState, useEffect } from 'react';
import { ideDataClassList, ideDataModelList } from './api';
import SvgGet from '@components/svg-get/svg-get';
import { fun } from '@utils';
import { ifsIDEClassifyInfo, ifsIDEDataModelInfo } from 'ancillarySystem/interface';
import './data-source-list-style.less';

interface dataSourceListIfs {
  id?: string;
  searchText: string;
  showTitle?: boolean;
  isMulti?: boolean;
  chosenList?: ifsDataInfo[];
  etlFilter?: boolean;
  onChange: (list: ifsDataInfo[]) => void;
}

export interface ifsDataInfo {
  id: string;
  name: string;
  type?: string;
}

/**
 * 数据表选择数据源控件
 * @param props
 * @returns
 */
const DataSourceTree = (props: dataSourceListIfs): JSX.Element => {
  const { isMulti, searchText, showTitle, chosenList = [], onChange } = props;

  const [moduleList, setModuleList] = useState<ifsDataInfo[]>([]);
  const [typeList, setTypeList] = useState<ifsIDEClassifyInfo[]>([]);
  const [activeList, setActiveList] = useState<ifsDataInfo[]>(chosenList);
  const [closeIdList, setCloseIdList] = useState<string[]>([]);
  const [activeType, setActiveType] = useState<string>('0');

  useEffect(() => {
    // 获取数据源分类
    ideDataClassList().then((res) => {
      let list: ifsIDEClassifyInfo[] = [];
      if (res.errcode === 0 && res.data?.length) {
        list = res.data;
      } else {
        // 系统默认添加所有数据
        list = [
          {
            type: 0,
            id: '0',
            name: '所有数据',
            remark: '',
            parentId: '',
            isSystem: true,
            children: [],
          },
        ];
      }
      setTypeList(list);
    });
    getDataList();
  }, []);

  // 获取数据表列表
  const getDataList = (classifyId?: string): void => {
    ideDataModelList({
      class: !classifyId || classifyId === '0' ? '' : classifyId,
      sort: [{ sort: 'desc', field: 'create_time' }],
    }).then((res) => {
      let datas: ifsIDEDataModelInfo[] = [];
      if (res.errcode === 0 && res.data) {
        datas = res.data.list ?? [];
      }
      let list = fun.handleModelInfoToList(datas);
      if (props.etlFilter) {
        list = list.filter((e) => e.type !== 'etl');
      }
      setModuleList(list);
    });
  };

  /**
   * 关闭/打开
   * @param id
   */
  const handleClose = (id: string) => {
    setCloseIdList(closeIdList.includes(id) ? closeIdList.filter((closeId) => id !== closeId) : [...closeIdList, id]);
  };

  /**
   * 渲染树形列表
   * @param parentId
   * @returns
   */
  const renderTree = (list: ifsIDEClassifyInfo[]): JSX.Element => {
    if (list.length === 0) {
      return <></>;
    }

    return (
      <ul>
        {list.map((item) => (
          <li
            key={item.id}
            className={`${closeIdList.includes(item.id) ? 'close' : ''} ${activeType === item.id ? 'active' : ''} ${
              item.children && item.children.length ? 'hasChildren' : ''
            }`}
            onMouseDown={(e) => {
              e.stopPropagation();
              setActiveType(item.id);
              getDataList(item.id);
            }}
          >
            {item.children && item.children.length ? (
              <i
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleClose(item.id);
                }}
              />
            ) : null}
            <span>{item.name}</span>
            {renderTree(item.children ?? [])}
          </li>
        ))}
      </ul>
    );
  };

  /**
   * 渲染菜单
   * @returns
   */
  const renderMenus = (): JSX.Element => {
    return (
      <div className={'menus'}>
        {showTitle && <div className={'content-title'}>数据分类</div>}
        {renderTree(typeList)}
      </div>
    );
  };

  /**
   * 渲染模块列表
   * @returns
   */
  const renderModuleList = (): JSX.Element => {
    let list = moduleList;
    if (searchText !== '') {
      list = moduleList.filter((item) => item.name.indexOf(searchText) !== -1);
    }

    return (
      <div className={'moduleList'}>
        {showTitle && <div className={'content-title'}>数据源</div>}
        <ul>
          {list.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                const activeInfo = activeList.find((n) => n.id === item.id);
                let list = activeList;
                if (isMulti) {
                  list = activeInfo ? [...activeList.filter((n) => n.id !== item.id)] : [...activeList, item];
                } else {
                  list = activeInfo ? [] : [item];
                }
                setActiveList(list);
                onChange(list);
              }}
              className={activeList.filter((n) => item.id === n.id).length > 0 ? 'active' : ''}
            >
              <span className={'anticon'}>
                <SvgGet src={fun.handleDataSourceIconUrlGet(item.type)}></SvgGet>
              </span>
              {item.name}
              <SvgGet src={'/fileServer/icons/all/bs-check.svg'} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={'dataSourceListContent'}>
      {renderMenus()}
      {renderModuleList()}
    </div>
  );
};

export default DataSourceTree;
