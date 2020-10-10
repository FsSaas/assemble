import React from 'react';
import getComponent from '../common/utils/get-component';
import packLinks from '../common/utils/pack-links';
import getResFromDeps from '../common/utils/get-resources-from-deps';

export default props => {
  let {
    name,
    links = [],
    statics = {},
    appResources = {},
    'resource-deps': resourceDeps = [],
  } = props;

  let linkObjs = packLinks(links);
  linkObjs['history'] = history;

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
