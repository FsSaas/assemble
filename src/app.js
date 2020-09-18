import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Page from './components/page';
import Core from './common/class/core';
import history from './history';
import store from './store';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'init': false
    }
    let { config } = props;
    this.core = new Core(config);
    this.resources = this.core.initResources();
    store.config = config;
  }

  componentDidMount() {
    const makeRequest = async () => {
      await this.core.loadExternals();
      store.components = await this.core.loadComponents();
      this.setState({ 'init': true });
    }
    makeRequest();
  }

  render() {
    let { init } = this.state;
    let { pages = [] } = store.config;
    return <>
      { init ? <Router history={history}>
        <Switch>
          {pages.map(it => {
            return <Route exact key={it.name} path={it.path}>
              <Page
                layout={it.layout}
                components={it.components}
                resources={this.resources}
              />
            </Route>
          })}
        </Switch>
      </Router> : null}
    </>
  }
}
