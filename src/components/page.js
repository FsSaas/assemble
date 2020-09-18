import React from 'react';
import { getComponent } from '../common/core';
import Link from '../common/link';

const packResouces = (resources = [], resourcesObjs = {}) => {
  let reous = {};
  for (let i = 0; i < resources.length; i++) {
    let it = resources[i];
    if (typeof it == 'string') {
      reous[it] = resourcesObjs[it];
    } else if (typeof it == 'object') {
      let [rawKey] = Object.keys(it);
      reous[rawKey] = resourcesObjs[it[rawKey]];
    }
  }
  return reous;
}

const packLinks = links => {
  let linkInstances = [];
  for (let i=0; i<links.length; i++) {
    let it = links[i], itObj = {};
    if (typeof it == 'string') {
      itObj['name'] = it;
      itObj['value'] = it;
      linkInstances[it] = new Link(itObj);
    } else if (typeof it == 'object') {
      let [key] = Object.keys(it);
      itObj['name'] = key;
      itObj['value'] = it[key];
      linkInstances[key] = new Link(itObj);
    }
  }
  return linkInstances;
}

export default props => {
  let { layout, components, 'resources': resourcesObjs = {} } = props;
  let PageComponent, layoutProps = {};

  // 布局组件
  if (layout) {

    if (typeof layout == 'string') {
      PageComponent = getComponent(layout);
    } else if (typeof layout == 'object') {
      let { resources = [], statics = {} } = layout;
      PageComponent = getComponent(layout.name);
      layoutProps = Object.assign(layoutProps, { 'resources': packResouces(resources, resourcesObjs) }, statics);
    }
  } else {

    // 没有layout时，默认使用div
    PageComponent = 'div';
  }

  // 组织页面内组件
  let children = components.map(cmp => {
    let { name, slot, resources = [], links = [] } = cmp;

    let reous = packResouces(resources, resourcesObjs);
    let linkObjs = packLinks(links);
    let ElementComponent = getComponent(name);

    return <ElementComponent key={name} slot={slot} resources={reous} links={linkObjs} />
  });

  return <PageComponent {...layoutProps}>
    {children}
  </PageComponent>
}
