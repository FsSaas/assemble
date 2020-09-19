import React from 'react';
import getComponent from '../common/utils/get-component';
import getResFromDeps from '../common/utils/get-resources-from-deps';

export default props => {
  let {
    name,
    statics = {},
    appResources = {},
    'resource-deps': resourceDeps = [],
  } = props;

  let LayoutComponent = getComponent(name)
  let layoutProps = Object.assign(
    statics,
    { ...getResFromDeps(resourceDeps, appResources) },
  );

  return <>
    <LayoutComponent {...layoutProps}>
      {props.children}
    </LayoutComponent>
  </>
}
