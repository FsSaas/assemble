import React from 'react';
import getComponent from '../common/utils/get-component';
import packLinks from '../common/utils/pack-links';
import history from '../history';
import qs from 'querystring';
import getResFromDeps from '../common/utils/get-resources-from-deps';

export default props => {
  let {
    name,
    slot,
    links = [],
    statics = {},
    'resource-deps': resourceDeps = [], // 子组件依赖的数据源
    'query-deps': queryDeps = [],
    pageResources = {}
  } = props;

  let linkObjs = packLinks(links);
  let ElementComponent = getComponent(name);

  // 组装query对象
  let { search = '' } = history.location;
  search = search.replace(/^\?/, '');
  let queryParams = qs.parse(search);

  // 根据配置取出需要传入子组件的参数
  let params = {};
  queryDeps.forEach(it => {
    if (typeof it == 'object') {
      let [key] = Object.keys(it);
      params[key] = it[key];
    } else if (typeof it == 'string') {
      params[it] = queryParams[it];
    }
  });

  // 依赖页面上的Resources数据
  let depsData = getResFromDeps(resourceDeps, pageResources);

  return <ElementComponent
    key={name}
    slot={slot}
    links={linkObjs}
    {...statics}
    {...params}
    {...depsData}
  />
}
