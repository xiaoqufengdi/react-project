import './home-page-style.less';
import PageIndex from '../page';
const HomePage = (): JSX.Element => {
  return (
    <div className={'main-page'}>
      <div className={'main-page-left'}>
        <div className={'page-title-item'}>服务</div>
      </div>
      <div className={'main-page-right'}>
        <div className={'main-page-box'}>
          <PageIndex />
        </div>
      </div>
    </div>
  );
};
export default HomePage;
