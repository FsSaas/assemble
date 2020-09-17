import React, { useState, useEffect } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Page from './components/page';
import Core from './common/core';

export default props => {

  const core = new Core();
  let resources = core.initResources();
  let [render, setRender] = useState(false);

  useEffect(() => {
    const makeRequest = async () => {
      await core.loadExternals();
      await core.loadComponents();
      setRender(true);
    }
    makeRequest();
  }, []);

  return <>
    { render ? <Router>
      <Switch>
        {core.pages.map(page => <Route exact key={page.name} path={page.path}>
          <Page
            layout={page.layout}
            components={page.components}
            resources={resources}
          />
        </Route>)}
      </Switch>
    </Router> : null}
  </>
};