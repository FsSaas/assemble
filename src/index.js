import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import resources from './resources';
import authorization from './authorization';
import components from './components';
import externals from './externals';
import routers from './routers';
import appJson from './app.json';

export const Assemble = props => {

  let [app, setApp] = useState();

  useEffect(() => {
    const makeRequest = async () => {
      let {
        'resources': res,
        'authorization': auth,
        'externals': exts,
        'components': cmps,
        pages
      } = appJson;

      const instanceYml = {
        'externals': await externals(exts),
        'components': await components(cmps),
        'resources': resources(res),
      }

      let a = routers(pages);
      debugger
      setApp(a);

      console.log(instanceYml);
      console.log(instanceYml.resources.menu.getAll())
    }
    makeRequest();
  }, []);

  return <>
    { app }
  </>
};