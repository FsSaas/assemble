import React from 'react';
import getComponent from '../common/utils/get-component';
import Link from '../common/class/link';
import getResFromDeps from '../common/utils/get-resources-from-deps';

export default props => {
  let {
    name,
    links,
    statics = {},
    appResources = {},
    'resource-deps': resourceDeps = [],
  } = props;

  let linkObjs = new Link(links);
  let LayoutComponent = getComponent(name)
  let layoutProps = Object.assign(
    statics,
    { ...getResFromDeps(resourceDeps, appResources) },
    { 'links': linkObjs }
  );

  return <>
    <LayoutComponent {...layoutProps}>
      {props.children}
    </LayoutComponent>
  </>
}
