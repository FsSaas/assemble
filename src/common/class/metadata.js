import fetch from '../utils/fetch';
import format from 'string-template';

const getMethod = (methods, name) => {
  let [method] = methods.filter(it => it.name == name);
  return method;
}

const resCallback = response => res => {
  let { type, transform } = response;
  if (type == 'json') return res.json();
  if (type == 'text') return res.text();
  if (type === undefined) return res.json();
  return res;
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
      response = {}
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

    return fetch(uri, reqOpts).then(
      resCallback(response)
    )
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
    return send('list', uri, methods)(data);
  }

  new(data) {
    let { uri, methods } = this;
    return send('new', uri, methods)(data);
  }

  update(data) {
    let { uri, methods } = this;
    return send('update', uri, methods)(data);
  }

  delete(data) {
    let { uri, methods } = this;
    return send('delete', uri, methods)(data);
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
