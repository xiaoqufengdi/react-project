import { useState } from 'react';
import DataSourceModal, { ifsModelCollection } from '@components/data-source-pane/data-source-modal';
import PageIndex from '../page';

import './home-page-style.less';
const HomePage = (): JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const [modelInfo, setModelInfo] = useState<ifsModelCollection | null>(null);

  return (
    <div className={'main-page'}>
      <div className={'main-page-left'}>
        <div className={'page-title-item'} onClick={() => setShowModal(true)}>
          {modelInfo?.name ?? '服务'}
        </div>
      </div>
      <div className={'main-page-right'}>
        <div className={'main-page-box'}>
          <PageIndex />
        </div>
      </div>
      {showModal && (
        <DataSourceModal
          source={
            modelInfo
              ? {
                  id: modelInfo.collection_id,
                  name: modelInfo.name,
                }
              : null
          }
          onCancel={() => setShowModal(false)}
          onOk={(info) => {
            console.log('info---', info);
            setModelInfo(info);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};
export default HomePage;
