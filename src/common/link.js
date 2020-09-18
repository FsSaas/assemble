import { getPage } from './core';
import qs from 'querystring';
import history from '../history';

export default class Link {

  constructor(obj) {
    let { name, value } = obj;
    if (!obj || !obj.name || !obj.value) throw new Error('Link参数结构异常');
    this.name = name;
    this.value = value;
  }

  goto(ars = {}) {
    let query = qs.stringify(ars)
    let { name, path } = getPage(this.name);
    history.push(`${path}?${query}`);
  }
}
