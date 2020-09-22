import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import auth from '../common/class/auth';
import Cmp from './cmp';
import Layout from './layout';
import qs from 'querystring';
import history from '../history';
import getResource from '../common/utils/get-resource';
import getResFromDeps from '../common/utils/get-resources-from-deps';

export default props => {
  let {
    name,
    layout, // 布局
    components, // 组件集合
    resources = [],
    appResources = {},
    query = [], // 参数对象
    'resource-deps': resourceDeps = [] // 页面依赖App数据
  } = props;

  let [pageResources, setPageResources] = useState({});

  // 规则验证 Query 对象
  if (query.length) {
    let { search = '' } = history.location;
    search = search.replace(/^\?/, '');
    let queries = qs.parse(search);
    // 数据中心定义了对象但真实运行环境没有，报错
    let paramsKeys = Object.keys(queries);
    if (!paramsKeys.length) {
      throw new Error(`页面缺少参数: ${JSON.stringify(query)}`);
    }
  }

  /**
   * 获取所有配置页面级数据源
   */
  useEffect(() => {
    const makeResources = async () => {
      if (resources.length) {
        let promises = resources.map(it => getResource(it));
        Promise.all(promises)
          .then(resources => {
            let res = {};
            resources.forEach(it => res[it.name] = it.value);
            setPageResources(res);
          })
      }
    }
    makeResources();
  }, []);

  // 页面依赖的APP数据
  let appDeps = getResFromDeps(resourceDeps, appResources);

  // 组织页面内组件
  let children = components.map(cmp => {
    return <Cmp {...cmp} key={cmp.name} pageResources={Object.assign({}, pageResources, appDeps)} />;
  });

  // 格式化 layout 配置
  let LayoutComponent = Layout;
  if (!layout) {
    LayoutComponent = 'div';
  } else if (typeof layout == 'string') {
    layout = { 'name': layout };
  }

  let childrenList = [];

  // 权限判断、跳转
  const { access, path = '' } = auth(name);
  if (!access) {
    childrenList.push(<Redirect key="redirect" to={path} pathname={path} push />);
    LayoutComponent = 'div';
  } else {
    childrenList = children;
  }

  return <>
    <LayoutComponent {...layout} appResources={appResources}>
      {childrenList}
    </LayoutComponent>
  </>
}
