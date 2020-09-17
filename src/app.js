import React, { useState, useEffect } from 'react';
import Core from './core';

export default props => {

  let [render, setRender] = useState();
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
    { render ? core.initRouters() : null }
  </>
};