import format from 'string-template';
import qs from 'qs';

export default class {

  constructor(resource) {
    let { uri, fields, actions } = resource || {};
    this.actions = actions;
    this.uri = uri;
    this._fields = [];
    this.resource = resource;
    let self = this;

    /**
     * 处理请求对象的字段
     */
    fields.forEach(it => {
      if (typeof it == 'string') {
        this._fields.push({ 'name': it });
      } else if (typeof it == 'object') {
        this._fields.push(it);
      }
    });

    /**
     * 根据配置创建组件调用事件句柄
     */
    actions.forEach(it => {
      let { name, } = it;
      self[name] = data => {
        return this.send(name, data);
      }
    })
  }

  /**
   * 整合 Fields 和 行为参数的值，提供请求使用
   * @param {*} actionArgs 
   */
  getComputeData(actionArgs) {
    let data = {};
    // 整合配置的Fields中的值
    this._fields.map(field => {
      let { name, type, value } = field;
      // 根据 Field 类型获取值
      switch (type) {
        case 'query':
          let hashQuery = (location.hash || '').replace(/^.+?\?/, '');
          let query = qs.parse(hashQuery);
          data[name] = query[value];
          break;
        case 'arguments':
          data[name] = actionArgs[value];
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
    Object.assign(data, actionArgs);
    return data;
  }

  peerSend(config, data, key) {
    let computeData = this.getComputeData(data);
    let {
      uri,
      method,
      headers = {},
      body = {},
      response = {},
      request = {},
    } = config;

    // 默认值处理
    uri = uri || this.uri;
    method = method || 'GET';

    // 解析RUI中的占位符，替换为真实字符串
    uri = format(uri, computeData);

    // 解析请求实体
    let reqBody = {};
    let { 'format': bodyDataFormat } = body
    if (bodyDataFormat) {
      try {
        // 格式化请求实体，执行代码
        let formatBodyFn = new Function('data', bodyDataFormat);
        reqBody = formatBodyFn(computeData);
      } catch (err) {
        console.error('请求实体格式化异常', err);
      }
    } else {
      reqBody = data;
    }

    // 处理请求参数
    let reqOpts = { method, headers };
    if (method == 'GET' || method == 'HEAD') {
      // 
    } else {
      // 处理 FormData 格式
      if ((headers['Content-Type'] || '').match(/x-www-form-urlencoded/)) {
        reqOpts['body'] = new URLSearchParams(qs.stringify(reqBody));
      } else {
        reqOpts['body'] = JSON.stringify(reqBody);
      }
    }

    // 处理GET请求参数
    if (
      data && method == 'GET' && // GET请求，并且有参数
      request && request.format // 配置了请求参数格式化
    ) {
      // Format请求参数
      let formatedQuery = {};
      for (let it of Object.entries(request.format)) {
        let [newKey, staKey] = it;
        formatedQuery[newKey] = data[staKey];
      }
      uri = uri + '?' + qs.stringify(formatedQuery);
    }

    /**
     * 构建请求
     */
    return fetch(uri, reqOpts)
      // 处理返回接口结构
      .then(res => {
        let { type } = response || {};
        if (type == 'json') return res.json();
        if (type == 'text') return res.text();
        if (type === undefined) return res.json();
        return res;
      })
      // 处理请求后参数
      .then(res => {
        let { 'format': formatRes } = response || {};
        // 格式化请求后数据
        if (formatRes) {
          let formatResFn = new Function('res', formatRes);
          let newRes = formatResFn(res);
          return newRes;
        }
        return res;
      })
      .catch(err => {
        console.error(err);
      })
  }

  send(key, data = {}) {
    let [methodConfig] = this.actions.filter(it => it.name == key);
    let {
      patchs,
    } = methodConfig || {};
    /**
     * 处理多个请求返回接口
     */
    return Promise.all(
      patchs.map(conf => this.peerSend(conf, data, key))
    ).then(res => {
      if (patchs.length == 1) return res[0];
      return res;
    });
  }
}
