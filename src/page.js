import React from 'react';
import { getComponent } from './core';

export default props => {
  let { layout, components } = props;
  let PageComponent = getComponent(layout);

  return <PageComponent>
    {components.map(cmp => {
      let { name, slot, resources, } = cmp;
      let ElementComponent = getComponent(name);
      return <ElementComponent slot={slot} resources={resources} />
    })}
  </PageComponent>
}
