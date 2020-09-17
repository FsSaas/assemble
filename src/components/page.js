import React from 'react';
import { getComponent } from '../core';

export default props => {
  let { layout, components } = props;
  let PageComponent = getComponent(layout);
  let children = components.map(cmp => {
    let { name, slot, resources, } = cmp;
    let ElementComponent = getComponent(name);
    return <ElementComponent key={name} slot={slot} resources={resources} />
  });
  return <PageComponent>{children}</PageComponent>
}
