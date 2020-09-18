import React from 'react';
import Resource from './resource';

const store = {}

const createScript = (uri, callback) => {
  let head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.src = uri;
  script.async = false;
  // script.crossOrigin = "anonymous";
  script.onload = () => { callback() };
  head.appendChild(script);
}

const createLink = uri => {
  let head = document.getElementsByTagName('head')[0];
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = uri;
  link.media = 'all';
  // link.crossOrigin = "anonymous";
  head.appendChild(link);
}

export const getPage = name => {
  let [page] = store.pages.filter(it => it.name == name);
  if (!page) {
    throw new Error('未找到页面: ' + page);
  }
  let { components, layout, ...rest } = page;
  return rest;
}

/**
 * 获取组件对象
 */
export const getComponent = name => {
  let [cmp] = store.components.filter(it => it.name == name);
  if (!cmp) {
    throw new Error('未找到组件: ' + name);
  }
  // UMD 加载的组件，组件在 default 属性内
  let CmpClass = cmp.class;
  if (typeof CmpClass !== 'function' && !!CmpClass.default) {
    CmpClass = CmpClass.default
  }
  return CmpClass;
}

export default class Core {

  constructor(meta) {
    this.global = window;
    this.resources = meta.resources;
    this.authorization = meta.authorization;
    this.externals = meta.externals;
    this.components = meta.components;
    this.pages = store.pages = meta.pages;
  }

  loadComponents() {
    return this._loadComponents()
      .then(cmps => {
        store.components = cmps;
        return cmps;
      });
  }

  loadExternals() {
    return this._loadExternals()
      .then(externals => {
        store.externals = externals;
        return externals;
      });
  }

  _getValueFormPath(path) {
    try {
      let data = this.global;
      let paths = path.split('.');
      for (let i = 0; i < paths.length; i++) {
        data = data[paths[i]];
      }
      return data;
    } catch (e) {
      throw new Error('未找到组件 ' + path);
    }
  }

  _loadComponents() {
    return Promise.all(
      this.components.map(it => {
        let { name, 'source': { type, uri, path } } = it;
        if (type == 'uri') {
          return new Promise((resolve, reject) => {
            createScript(uri, () => {
              resolve({
                name,
                'class': this.global[path]
              })
            })
          })
        } else if (type == 'local') {
          return Promise.resolve({
            name, 'class': this._getValueFormPath(path)
          })
        }
      })
    )
  }

  _loadExternals() {
    return Promise.all(
      this.externals.map(it => {
        return new Promise((resolve, reject) => {
          let { type, uri } = it;
          if (type == 'script') {
            createScript(uri, () => {
              resolve(it);
            });
          } else if (type == 'style') {
            createLink(uri);
            resolve(it);
          }
        })
      })
    );
  }

  initResources() {
    let res = {};
    for (let i = 0; i < this.resources.length; i++) {
      let it = this.resources[i];
      res[it.name] = new Resource(it);
    }
    return res;
  }
}