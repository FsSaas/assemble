import qs from 'querystring';
import getPage from '../utils/get-page';
import history from '../../history';

export default class Link {

  constructor(obj) {
    let { name, value } = obj;
    if (!obj || !obj.name || !obj.value) throw new Error('Link参数结构异常');
    this.name = name;
    this.value = value;
  }

  goto(ars = {}) {
    let search = qs.stringify(ars)
    let { path } = getPage(this.value);
    history.push(`${path}?${search}`);
  }
}
