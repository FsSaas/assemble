import { type } from 'os';
import React from 'react';
import { getComponent } from '../common/core';

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

export default props => {
  let { layout, components, 'resources': resourcesObjs = {} } = props;

  // 获取布局组件
  let PageComponent, layoutProps = {};

  if (typeof layout == 'string') {

    PageComponent = getComponent(layout);
  } else if (typeof layout == 'object') {

    let { resources = [], statics = {} } = layout;

    PageComponent = getComponent(layout.name);
    layoutProps = Object.assign(layoutProps, { 'resources': packResouces(resources, resourcesObjs) }, statics);
  }

  // 组织页面内组件
  let children = components.map(cmp => {
    let { name, slot, resources = [], } = cmp;

    let reous = packResouces(resources);
    let ElementComponent = getComponent(name);

    return <ElementComponent key={name} slot={slot} resources={reous} />
  });

  return <PageComponent {...layoutProps}>
    {children}
  </PageComponent>
}
