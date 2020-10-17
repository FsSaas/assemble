import React from 'react';
import getComponent from '../common/utils/get-component';
import packLinks from '../common/utils/pack-links';
import history from '../history';
import qs from 'querystring';
import getResFromDeps from '../common/utils/get-resources-from-deps';
import store from '../store';
import Metadata from '../common/class/metadata';

export default class CMP extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'hasError': false
    }
  }

  /**
   * 组件出现异常时不影响页面，控制范围在组件本身
   * @param {*} error 
   * @param {*} info 
   */
  componentDidCatch(error, info) {
    console.log(error, info);
    this.setState({ 'hasError': true });
  }
  
  render() {
    let { hasError } = this.state;
    if (hasError) {
      return <span>Error</span>
    }

    let {
      name,
      slot,
      links = [],
      statics = {},
      'resource-deps': resourceDeps = [], // 子组件依赖的数据源
      'query-deps': queryDeps = [],
      'metadata-dep': metadataDepName,
      pageResources = {}
    } = this.props;

    let linkObjs = packLinks(links);
    linkObjs['history'] = history;

    let ElementComponent = getComponent(name);

    // 组装query对象
    // 根据配置取出需要传入子组件的参数
    let params = {};
    if (queryDeps.length) {
      let { search = '' } = history.location;
      search = search.replace(/^\?/, '');
      let queryParams = qs.parse(search);
      // 循环Query依赖配置，提取参数
      queryDeps.forEach(it => {
        if (typeof it == 'object') {
          let [key] = Object.keys(it);
          params[key] = queryParams[it[key]];
        } else if (typeof it == 'string') {
          params[it] = queryParams[it];
        }
      });
    }

    // 依赖页面上的Resources数据
    let depsData = getResFromDeps(resourceDeps, pageResources);

    /**
     * 数据源依赖
     * 处理METADATE
    */
    let depMeta = {};
    if (metadataDepName) {
      let { metadatas } = store.config;
      let [metaConf] = metadatas.filter(it => it.name == metadataDepName);
      if (metaConf)
        depMeta['metadata'] = new Metadata(metaConf);
    }

    return <ElementComponent
      key={name}
      slot={slot}
      links={linkObjs}
      {...statics}
      {...params}
      {...depsData}
      {...depMeta}
    />
  }
}
