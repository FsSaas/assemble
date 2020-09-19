import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import auth from '../common/class/auth';
import Cmp from './cmp';
import Layout from './layout';
import getResource from '../common/utils/get-resource';
import getResFromDeps from '../common/utils/get-resources-from-deps';

export default props => {
  let {
    layout, // 布局
    components, // 组件集合
    resources = [],
    appResources = {},
    'resource-deps': resourceDeps = [] // 页面依赖App数据
  } = props;

  let [pageResources, setPageResources] = useState({});

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
  let children = components.map(cmp => <Cmp {...cmp} pageResources={Object.assign({}, pageResources, appDeps)} />);

  // 权限判断、跳转
  const { access, path = '' } = auth();
  let childrenList = [];
  if (!access) childrenList.push(<Redirect to={path} />);
  childrenList = childrenList.concat(children);

  // 格式化 layout 配置
  let LayoutComponent = Layout;
  if (!layout) {
    LayoutComponent = 'div';
  } else if (typeof layout == 'string') {
    layout = { 'name': layout };
  }

  return <>
    <LayoutComponent {...layout} appResources={appResources}>
      {childrenList}
    </LayoutComponent>
  </>
}
