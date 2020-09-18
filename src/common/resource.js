import fetch from 'node-fetch';

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

  getAll() {
    if (this.type == 'restful') {
      return this.fetch(this.uri);
    } else {
      return this.value;
    }
  }
  getById(id) {
    return this.fetch(`${this.uri}?id=${id}`);
  }
  deleteById(id) {
    return this.fetch(`${this.uri}/${id}`, {
      'method': 'DELETE',
    });
  }
  newOne(data) {
    if (!data || typeof data !== 'object') throw new Error('Response.newOne(data) need "data" argument.')
    return this.fetch(this.uri, {
      'method': 'POST',
      'body': JSON.stringify(data)
    });
  }
  updateById(id, data) {
    if (!data || typeof data !== 'object') throw new Error('Response.updateById(id,data) need "data" argument.')
    return this.fetch(`${this.uri}/${id}`, {
      'method': 'PUT',
      'body': JSON.stringify(data)
    });
  }
  post(data) {
    return this.newOne(data);
  }
}

