import fetch from '../utils/fetch';
import format from 'string-template';
import qs from 'querystring';

const getMethod = (methods, name) => {
  let [method] = methods.filter(it => it.name == name);
  return method;
}

const apis = (uri) => ({
  'delete': {
    'method': 'DELETE',
    'uri': `${uri}/{id}`,
  },
  'update': {
    'method': 'PUT',
    'uri': `${uri}/{id}`
  },
  'new': {
    'method': 'POST',
    uri
  },
  'list': {
    'method': 'GET',
    uri
  },
  'columns': {
    'method': 'GET',
    'uri': `${uri}/columns`,
  },
  'fields': {
    'method': 'GET',
    'uri': `${uri}/fields`,
  }
});

const send = (key, defaultUri, metConfig) => {
  let api = apis(defaultUri)[key];
  return (data = {}) => {
    let methodConfig = getMethod(metConfig, key);
    let {
      uri,
      method,
      headers = {},
      body = {},
      response = {},
      request = {}
    } = methodConfig || {};

    // 默认值处理
    uri = uri || api.uri;
    method = method || api.method;

    // 解析RUI中的占位符，替换为真实字符串
    uri = format(uri, data);

    // 解析请求实体
    // 通过配置组装请求对象
    let reqBody = data;
    let bodKeys = Object.entries(body);
    if (bodKeys.length) {
      let mappedBody = {};
      for (let it of bodKeys) {
        let [key, value] = it;
        mappedBody[key] = data[value];
      }
      reqBody = mappedBody;
    }

    // 处理请求参数
    let reqOpts = { method, headers };
    if (method == 'GET' || method == 'HEAD') {
      // Fetch GET/HEAD do not have 'body'
    } else {
      reqOpts['body'] = JSON.stringify(reqBody)
    }

    // 处理GET请求参数
    if (
      data && data.query && method == 'GET' && // GET请求，并且有参数
      request && request.format // 配置了请求参数格式化
    ) {
      // Format请求参数
      let formatedQuery = {};
      for (let it of Object.entries(request.format)) {
        let [newKey, staKey] = it;
        formatedQuery[newKey] = data.query[staKey];
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
        let { format, 'format-eval': formatEval } = response || {};
        if (formatEval) {

          console.warn('不建议使用 format-eval 属性配置格式化参数，可通过数据接口或者自己定义组件解决');
          let newRes = eval(response['format-eval']); // eval 里会用到 res 参数
          return newRes;
        } else if (format) {

          // eval 里会用到 res 参数
          return res;
        } else {

          return res;
        }
      })
  }
}

export default class {
  constructor(resource) {
    let { name, type, uri, fields, methods } = resource || {};
    this.methods = methods;
    // this.fields = fields;
    this.type = type;
    this.name = name;
    this.uri = uri;
  }

  list(data) {
    let { uri, methods } = this;
    return send('list', uri, methods)({ 'query': data });
  }
  new(data) {
    let { uri, methods } = this;
    return send('new', uri, methods)({ 'body': data });
  }
  update(data) {
    let { uri, methods } = this;
    return send('update', uri, methods)({ 'body': data });
  }
  delete(data) {
    let { uri, methods } = this;
    return send('delete', uri, methods)({ 'body': data });
  }
  columns() {
    let { uri, methods } = this;
    return send('columns', uri, methods)();
  }
  fields() {
    let { uri, methods } = this;
    return send('fields', uri, methods)();
  }
}
