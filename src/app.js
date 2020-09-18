import React, { useState, useEffect } from 'react';
import {
  Router,
  Switch,
  Route,
} from 'react-router-dom';
import Page from './components/page';
import Core from './common/core';
import history from './history';

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
      await this.core.loadExternals();
      await this.core.loadComponents();
      this.setState({ 'init': true });
    }
    makeRequest();
  }

  render() {
    let { init } = this.state;
    return <>
      { init ? <Router history={history}>
        <Switch>
          {this.core.pages.map(it => {
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
};