import qs from 'querystring';
import format from 'string-template';
import history from '../../history';

export default class Link {

  constructor(config) {
    if (config) {
      let { fields, links } = config;
      this.fields = fields;
      this.links = links;
      this.attachFn(links);
    }
    this.history = history;
  }

  /**
    * 整合 Fields 和 参数的值，提供请求使用
    * @param {*} args 
    */
  getComputeData(args) {
    let data = {};
    // 整合配置的Fields中的值
    this.fields.map(field => {
      let { name, type, value } = field;
      // 根据 Field 类型获取值
      switch (type) {
        case 'query':
          let hashQuery = (location.hash || '').replace(/^.+?\?/, '');
          let query = qs.parse(hashQuery);
          data[name] = query[value];
          break;
        case 'arguments':
          data[name] = args[value];
          break;
        case 'local':
          data[name] = localStorage.getItem(value);
          break;
        case 'session':
          data[name] = sessionStorage.getItem(value);
          break;
        default: break;
      }
    });
    // 整个行为参数值
    Object.assign(data, args);
    return data;
  }

  /**
   * 根据配置项，添加对应方法
   */
  attachFn(links) {
    for (let it of Object.entries(links)) {
      let [key, value] = it;
      // 组件内部调用的API
      this[key] = {
        'goto': (args = {}) => {
          let computeData = this.getComputeData(args);
          let path = format(value.path, computeData);
          this.history.push(path);
        },
        'getRawPath': (args = {}) => {
          let computeData = this.getComputeData(args);
          let path = format(value.path, computeData);
          return path;
        }
      }
    }
  }

  // 通过path跳转路由，不推荐
  go(path) {
    this.history.push(path);
  }

  // 返回上一页
  goBack() {
    this.history.goBack();
  }
}
