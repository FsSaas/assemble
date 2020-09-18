import React from 'react';
import { Redirect } from 'react-router-dom';
import getComponent from '../common/utils/get-component';
import auth from '../common/class/auth';
import packLinks from '../common/utils/pack-links';
import packResources from '../common/utils/pack-resources';

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
      layoutProps = Object.assign(
        layoutProps,
        { 'resources': packResources(resources, resourcesObjs) },
        statics
      );
    }
  } else {
    // 没有layout时，默认使用div
    PageComponent = 'div';
  }

  // 组织页面内组件
  let children = components.map(cmp => {
    let { name, slot, resources = [], links = [] } = cmp;
    let reous = packResources(resources, resourcesObjs);
    let linkObjs = packLinks(links);
    let ElementComponent = getComponent(name);
    return <ElementComponent key={name} slot={slot} resources={reous} links={linkObjs} />
  });

  // 权限判断、跳转
  const { access, path = '' } = auth();

  return <PageComponent {...layoutProps}>
    {!access ? <Redirect to={path} /> : null}
    {children}
  </PageComponent>
}
