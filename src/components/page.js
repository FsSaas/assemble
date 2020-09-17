import React from 'react';
import { getComponent } from '../common/core';

export default props => {
  let { layout, components, 'resources': resourcesObjs } = props;
  let PageComponent = getComponent(layout);

  let children = components.map(cmp => {
    let { name, slot, resources, } = cmp;
    
    // 组装 resources 数据
    let reous = {};
    for (let i=0; i<resources.length; i++) {
      let it = resources[i];
      reous[it] = resourcesObjs[it];
    }

    let ElementComponent = getComponent(name);
    return <ElementComponent key={name} slot={slot} resources={reous} />
  });

  return <PageComponent>{children}</PageComponent>
}
