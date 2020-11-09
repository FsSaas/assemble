import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Page from './components/page';
import Core from './common/class/core';
import history from './history';
import store from './store';
import getResources from './common/utils/get-resources';
import schema from './schema';
import fetch from './common/utils/fetch';

// 用于统一处理权限验证
window.fetch = fetch;

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
      // 加载组件
      store.components = await this.core.loadComponents();
      let res = await getResources(store.config.resources);
      this.setState({
        'init': true,
        'resData': res
      });
      /**
       * 如果只有一个页面，则默认跳转当前页面
       */
      let { pages = [] } = store.config;
      if (pages.length == 1) {
        let page = pages[0];
        history.push(page.path);
      }
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
