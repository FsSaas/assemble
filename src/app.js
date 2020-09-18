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
    this.core = new Core(props.config);
    this.resources = this.core.initResources();
  }

  componentDidMount() {
    const makeRequest = async () => {
      store.externals = await this.core.loadExternals();
      store.components = await this.core.loadComponents();
      store.pages = this.core.pages;
      this.setState({ 'init': true });
    }
    makeRequest();
  }

  render() {
    let { init } = this.state;
    return <>
      { init ? <Router history={history}>
        <Switch>
          {store.pages.map(it => {
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
