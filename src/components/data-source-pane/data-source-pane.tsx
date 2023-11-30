import { memo, useState } from 'react';
import SearchInput from '@components/search-input/search-input';
import DataSourceList, { ifsDataInfo } from './data-source-list';
import './data-source-pane-style.less';

interface ifsDataSoucrePane {
  isMulti?: boolean; // 数据源是否多选
  style?: React.CSSProperties;
  chosenList?: ifsDataInfo[];
  onChange: (list: ifsDataInfo[]) => void;
  etlFilter?: boolean;
}

/**
 * 数据源添加
 * @param props
 * @returns
 */
const DataSoucrePane = (props: ifsDataSoucrePane): JSX.Element => {
  const { isMulti, chosenList, onChange, style } = props;
  const [searchText, setSearchText] = useState<string>('');

  /**
   * 渲染标题
   * @returns
   */
  const renderTitle = (): JSX.Element => {
    const app_name = localStorage.getItem('app_name') ?? 'app_test';
    return (
      <div className={'title'}>
        <h3>{app_name}</h3>
        <SearchInput
          placeholder={'搜索'}
          onSearch={(value) => setSearchText(value)}
          style={{ width: 200, borderRadius: 4, border: '1px solid #d9d9d9' }}
        />
      </div>
    );
  };

  return (
    <div className={'datasourcePane'} style={style}>
      {renderTitle()}
      <DataSourceList etlFilter={props.etlFilter} showTitle isMulti={isMulti} chosenList={chosenList} searchText={searchText} onChange={onChange} />
    </div>
  );
};

export default memo(DataSoucrePane);
