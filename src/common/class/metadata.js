import fetch from '../utils/fetch';
import format from 'string-template';
import queryString from 'query-string';

const getMethod = (methods, name) => {
  let [method] = methods.filter(it => it.name == name);
  return method;
}

export default class {
  constructor(resource) {
    let { name, type, uri, fields, methods } = resource || {};

    this.methods = methods;
    this.type = type;
    this.name = name;
    this.uri = uri;
    this._fields = [];

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

    // 获取Field字段的值
    this._fields.forEach(it => {
      if (it.from) {
        if (it.from == 'url-query') {
          let hashQuery = (location.hash || '').replace(/^.+?\?/, '');
          let query = queryString.parse(hashQuery);
          it.value = query[it.key || it.name];
        }
      } else {
        it.from = 'data'; // 初始化数据，从Data中
      }
    });

    methods.forEach(it => {
      let { name } = it;
      this[name] = data => {
        return this.send(name, data);
      }
    })
  }

  /**
   * 通过配置Fields初始化数据
   * @param {事件传递的参数} data 
   */
  getFields(data) {
    let envFields = [];
    this._fields.forEach(it => {
      if (it.from == 'data') {
        envFields.push({
          'name': it.name,
          'value': data[it.name]
        });
      } else {
        envFields.push(it);
      }
    });
    return envFields;
  }

  send(key, data = {}) {
    let envVars = this.getFields(data);
    console.log(envVars, 'envVars')
    let methodConfig = getMethod(this.methods, key);
    let {
      uri,
      method,
      headers = {},
      body = {},
      response = {},
      request = {}
    } = methodConfig || {};

    // 默认值处理
    uri = uri || this.uri;
    method = method || 'GET';

    // 解析RUI中的占位符，替换为真实字符串
    let vars = {};
    envVars.forEach(it => vars[it.name] = it.value);
    uri = format(uri, vars);

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
      data && method == 'GET' && // GET请求，并且有参数
      request && request.format // 配置了请求参数格式化
    ) {
      // Format请求参数
      let formatedQuery = {};
      for (let it of Object.entries(request.format)) {
        let [newKey, staKey] = it;
        formatedQuery[newKey] = data[staKey];
      }
      uri = uri + '?' + queryString.stringify(formatedQuery);
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
