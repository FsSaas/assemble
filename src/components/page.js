import React from 'react';
import { Redirect } from 'react-router-dom';
import qs from 'querystring';
import getComponent from '../common/utils/get-component';
import auth from '../common/class/auth';
import packLinks from '../common/utils/pack-links';
import packResources from '../common/utils/pack-resources';
import history from '../history';


export default props => {
  let {
    layout, // 布局
    components, // 组件集合
    query = [], // 页面访问参数
    'resources': resourcesObjs = {} // 实例后的资源
  } = props;

  let PageComponent, layoutProps = {};

  // 组装query对象
  let { search = '' } = history.location;
  search = search.replace(/^\?/, '');
  let queryParams = qs.parse(search);

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

    // 根据配置取出需要传入子组件的参数
    let params = {};
    query.forEach(it => {
      if (typeof it == 'object') {
        let [key] = Object.keys(it);
        params[key] = it[key];
      } else if (typeof it == 'string') {
        params[it] = queryParams[it];
      }
    });

    return <ElementComponent
      key={name}
      slot={slot}
      resources={reous}
      links={linkObjs}
      {...params}
    />
  });

  // 权限判断、跳转
  const { access, path = '' } = auth();
  let childrenList = [];
  if (access) childrenList.push(<Redirect to={path} />);
  childrenList = childrenList.concat(children);

  return <PageComponent {...layoutProps}>
    {childrenList}
  </PageComponent>
}
