
import React from 'react';
import Resource from './resource';
import createScript from '../utils/create-script';
import createLink from '../utils/create-link';

export default class Core {

  constructor(meta) {
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
        return cmps;
      });
  }

  loadExternals() {
    return this._loadExternals()
      .then(externals => {
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