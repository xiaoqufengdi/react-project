import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

const HomePage = React.lazy(() => import('./container/home/home-page'));

const PageRouter: React.FC = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path={'/'} component={HomePage} exact />
      </Switch>
    </Router>
  );
};

export default PageRouter;
