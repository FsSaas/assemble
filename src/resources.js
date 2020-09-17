import fetch from 'node-fetch';

class Resource {

  constructor(opts) {
    let { uri = '', value, type = 'restful' } = opts;
    this.uri = uri;
    this.value = value;
    this.type = type;
    this.headers = {
      'content-type': 'application/json'
    };
    this.raw = opts;
    this.response;
    this.error;
    if (!uri) this.type = 'static';
  }

  getValue() {
    return value;
  }

  fetch(uri, opts) {
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
    return this.fetch(this.uri);
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
}

export default meta => {
  for (let resource of Object.entries(meta)) {
    let [name, value] = resource;
    meta[name] = new Resource(value);
  }
  return meta;
}
