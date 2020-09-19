import fetch from 'node-fetch';
import qs from 'querystring';

export default class Resource {
  constructor(opts) {
    let { uri = '', value, type = 'restful' } = opts;
    this.uri = uri;
    this.value = value;
    this.type = type;
    this.headers = {
      'content-type': 'application/json'
    };
    this.raw = opts;
    this.response = null;
    this.error = null;
    if (!uri) this.type = 'static';
  }

  fetch(uri, opts = {}) {
    if (!opts.headers) opts.headers = {}
    opts.headers['content-type'] = 'application/json';
    opts.headers['method'] = opts.headers['method'] || 'GET';
    return fetch(uri, opts)
      .then(res => res.json())
      .then(res => this.response = res)
      .catch(err => {
        this.error = err;
        throw err;
      });
  }
  get(args) {
    return this.getAll(args);
  }
  getAll(args) {
    if (this.type == 'restful') {
      return this.fetch(`${this.uri}?${qs.stringify(args)}`);
    } else {
      return Promise.resolve(this.value);
    }
  }
  post(data) {
    return this.fetch(this.uri, {
      'body': JSON.stringify(data),
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      }
    });
  }
}

