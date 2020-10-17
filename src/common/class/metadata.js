import format from 'string-template';
import qs from 'qs';

export default class {
  constructor(resource) {
    let { uri, fields, actions } = resource || {};
    this.actions = actions;
    this.uri = uri;
    this._fields = [];
    // 记录原参数
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

    // 获取Field字段的值
    this._fields.forEach(it => {
      let { type = 'data' } = it;
      switch (type) {
        case 'query':
          let hashQuery = (location.hash || '').replace(/^.+?\?/, '');
          let query = qs.parse(hashQuery);
          it.value = query[it.value];
          break;
        case 'static':
          // it.value
          break;
        case 'local':
          it.value = localStorage.getItem(it.key);
          break;
        case 'session':
          it.value = sessionStorage.getItem(it.key);
          break;
        case 'data':
          // 初始化数据，从Data中
          it.type = 'data';
          break;
        default: break;
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
   * 通过配置Fields初始化数据
   * @param {事件传递的参数} data 
   */
  getFields(data) {
    let envFields = [];
    this._fields.forEach(it => {
      if (it.type == 'data') {
        envFields.push({ 'name': it.name, 'value': data[it.name] });
      } else {
        envFields.push(it);
      }
    });
    return envFields;
  }

  /**
   * 通过用户配置的key返回需要的值
   * uri template
   * body
   * @param {*} it 
   * @param {*} data 
   */
  getDataFromData(it, data) {
    let res = {};
    let { name, type, value } = it;
    // query 在 url query 中取值
    if (type == 'query') {
      let [field] = this._fields.filter(it => it.name = name);
      res[name] = field.value;
    }
    // arguments 在 api 参数中取值
    else if (type == 'arguments') {
      res[name] = data[value];
    }
    return res;
  }

  /**
   * 单个请求
   * @param {*} config 
   */
  peerSend(config, data, key) {
    let envVars = this.getFields(data);
    let {
      uri,
      method,
      headers = {},
      body = [],
      response = {},
      request = {},
    } = config;

    // 默认值处理
    uri = uri || this.uri;
    method = method || 'GET';

    // 解析RUI中的占位符，替换为真实字符串
    let vars = {};
    envVars.forEach(it => {
      let keyData = this.getDataFromData(it, data);
      Object.assign(vars, keyData);
    });
    uri = format(uri, vars);

    // 解析请求实体
    // 通过配置组装请求对象
    let reqBody = data;
    if (body.length) {
      let mappedBody = {};
      body.forEach(it => {
        let keyData = this.getDataFromData(it, data);
        Object.assign(mappedBody, keyData);
      })
      reqBody = mappedBody;
    }

    // 处理请求参数
    let reqOpts = { method, headers };
    if (method == 'GET' || method == 'HEAD') {
      // Fetch GET/HEAD do not have 'body'
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
