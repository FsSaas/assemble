import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Page from './components/page';
import Core from './core';

export default props => {

  let [render, setRender] = useState(false);
  let [externals, setExternals] = useState();
  let [components, setComponents] = useState();
  let [resources, setResources] = useState();

  const core = new Core();

  useEffect(() => {
    const makeRequest = async () => {
      let exts = await core.loadExternals();
      let cmps = await core.loadComponents();
      let res = core.initResources();
      setExternals(exts);
      setComponents(cmps);
      setResources(res);
      setRender(true);
    }
    makeRequest();
  }, []);

  return <>
    { render ? <Router>
      <Switch>
        {core.pages.map(page => <Route key={page.name} path={page.path}>
          <Page layout={page.layout} components={page.components} />
        </Route>)}
      </Switch>
    </Router> : null}
  </>
};