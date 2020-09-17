import React from 'react';
import Resource from './resource';
import appJson from '../app.json';

const store = {}

/**
 * 获取组件对象
 */
export const getComponent = name => {
  let [cmp] = store.components.filter(it => it.name == name);
  if (!cmp) {
    throw new Error('未找到组件: ' + name);
  }
  let CmpClass = cmp.class;
  if (typeof CmpClass !== 'function' && !!CmpClass.default) {
    CmpClass = CmpClass.default
  }
  return CmpClass;
}

export default class Core {

  constructor(meta = appJson) {
    this.global = window;
    this.resources = meta.resources;
    this.authorization = meta.authorization;
    this.externals = meta.externals;
    this.components = meta.components;
    this.pages = meta.pages;
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
            const script = document.createElement('script');
            script.src = uri;
            script.async = false;
            // script.crossOrigin = "anonymous";
            document.body.appendChild(script);
            script.onload = () => {
              resolve({
                name, 'class': this.global[path]
              });
            }
          })
        } else if (type == 'local') {
          return Promise.resolve({
            name, 'class': this._getValueFormPath(path)
          });
        }
      })
    );
  }

  _loadExternals() {
    return Promise.all(
      this.externals.map(it => {
        return new Promise((resolve, reject) => {
          let { type, uri } = it;
          let head = document.getElementsByTagName('head')[0];
          let tag;
          if (type == 'script') {
            tag = document.createElement('script');
            tag.src = uri;
            tag.async = false;
            // tag.crossOrigin = "anonymous";
          } else if (type == 'style') {
            tag = document.createElement('link');
            tag.rel = 'stylesheet';
            tag.type = 'text/css';
            tag.href = uri;
            tag.media = 'all';
          }
          head.appendChild(tag);
          tag.onload = () => {
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