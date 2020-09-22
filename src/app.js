import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Page from './components/page';
import Core from './common/class/core';
import history from './history';
import store from './store';
import getResource from './common/utils/get-resource';
import schema from './common/utils/schema';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'init': false,
      'resData': {}
    }
    let { config } = props;
    schema(config); // 对 scheme 进行验证
    this.core = new Core(config);
    store.config = config;
  }

  componentDidMount() {
    const makeRequest = async () => {
      await this.core.loadExternals();
      store.components = await this.core.loadComponents();
      let promises = store.config.resources.map(it => getResource(it));
      let resources = await Promise.all(promises)
      let res = {};
      resources.forEach(it => res[it.name] = it.value);
      this.setState({
        'init': true,
        'resData': res
      })
    }
    makeRequest();
  }

  render() {
    let { init, resData } = this.state;
    let { pages = [] } = store.config;
    return <>
      { init ? <Router history={history}>
        <Switch>
          {pages.map(it => {
            return <Route exact key={it.name} path={it.path}>
              <Page
                {...it}
                appResources={resData}
              />
            </Route>
          })}
        </Switch>
      </Router> : null}
    </>
  }
}
