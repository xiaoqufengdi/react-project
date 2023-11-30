import Router from './pageRouter';
import { render } from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

const PageRouter = () => {
  return (
    <React.Suspense fallback={<></>}>
      <ConfigProvider locale={zhCN}>
        <Router />
      </ConfigProvider>
    </React.Suspense>
  );
};

render(<PageRouter />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
