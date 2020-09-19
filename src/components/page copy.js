import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import qs from 'querystring';
import getComponent from '../common/utils/get-component';
import auth from '../common/class/auth';
import packLinks from '../common/utils/pack-links';
import packResources from '../common/utils/pack-resources';
import history from '../history';


/**
 * 获取数据
 * @param {*} kv 
 * @param {*} object 
 */
const getResFromDeps = (deps = [], object) => {
  if (!deps.length) return {};
  let res = {};
  for (let i=0; i<deps.length; i++) {
    let kv = deps[i];
    if (typeof kv == 'string') kv = { [kv]: key };
    let [key] = Object.keys(kv);
    res[key] = object[key];
  }
  return res;
}

export default props => {
  let {
    layout, // 布局
    components, // 组件集合
    query = [], // 页面访问参数
    resources = []
  } = props;

  let [resData, setResData] = useState({});

  useEffect(() => {
    const makeResources = async () => {
      // 发送请求
      resources.forEach(it => {
        let res = await getResource(it);
        setResData(Object.assign(resData, { [it.name]: res }));
      })
    }
    makeResources();
  }, []);

  // 组装query对象
  let { search = '' } = history.location;
  search = search.replace(/^\?/, '');
  let queryParams = qs.parse(search);

  // 布局组件
  let LayoutComponent, layoutProps = {};
  if (layout) {
    if (typeof layout == 'string') {
      LayoutComponent = getComponent(layout);
    } else if (typeof layout == 'object') {
      let {
        'resource-deps': resourceDeps = [], // 布局组件依赖的数据源
        statics = {}
      } = layout;
      LayoutComponent = getComponent(layout.name);
      layoutProps = Object.assign(
        statics,
        { ...getResFromDeps(resourceDeps, resData) },
      );
    }
  } else {
    // 没有layout时，默认使用div
    LayoutComponent = 'div';
  }

  // 组织页面内组件
  let children = components.map(cmp => {
    let {
      name,
      slot,
      links = [],
      'resource-deps': resourceDeps = [] // 子组件依赖的数据源
    } = cmp;

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
      { ...getResFromDeps(resourceDeps, resData) }
    />
  });

  // 权限判断、跳转
  const { access, path = '' } = auth();
  let childrenList = [];
  if (access) childrenList.push(<Redirect to={path} />);
  childrenList = childrenList.concat(children);

  return <>
    <LayoutComponent {...layoutProps}>
      {childrenList}
    </LayoutComponent>
  </>
}
