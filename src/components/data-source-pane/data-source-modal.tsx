import { memo, useState } from 'react';
import { Modal, message } from 'antd';
import DataSourcePane from './data-source-pane';
import { dataserviceCollectionDetail } from './api';
import { ifsModelCollectionInfo } from 'ancillarySystem/interface';
import './data-source-modal-style.less';

export interface ifsModelCollection extends ifsModelCollectionInfo {
  name: string;
}

interface dataSourceModalProps {
  source?: {
    id: string;
    name: string;
    type?: string;
  } | null;
  onCancel: () => void;
  modalStyle?: React.CSSProperties;
  paneStyle?: React.CSSProperties;
  onOk: (data: ifsModelCollection) => void;
}

/**
 * 数据源选择
 * @param props
 * @returns
 */
const DataSourceModal = (props: dataSourceModalProps): JSX.Element => {
  const { source, onCancel, onOk, modalStyle, paneStyle } = props;
  const [dataInfo, setDataInfo] = useState<{
    id: string;
    name: string;
    type?: string;
  }>(source ?? ({} as never));

  return (
    <Modal
      className={'data-source-pane-modal'}
      style={{ top: 48, bottom: 48, ...modalStyle }}
      title={'选择数据表'}
      zIndex={1001}
      width={800}
      open
      okText={'确定'}
      cancelText={'取消'}
      onCancel={onCancel}
      onOk={() => {
        if (!dataInfo.id) {
          message.warning('请选择数据源', 1);
          return;
        }
        if (dataInfo.id !== source?.id) {
          // 获取数据源详情
          dataserviceCollectionDetail(dataInfo.id).then((res) => {
            if (res && res.collection_id) {
              onOk({
                ...res,
                name: dataInfo.name,
              });
            }
          });
        } else {
          // 所选数据源相同时不处理
          onCancel();
        }
      }}
    >
      <DataSourcePane
        // 动作弹窗暂时过滤etl，以免数据操作有bug
        etlFilter
        style={paneStyle}
        chosenList={[dataInfo]}
        onChange={(list) => {
          setDataInfo(list[0] ?? {});
        }}
      />
    </Modal>
  );
};

export default memo(DataSourceModal);
