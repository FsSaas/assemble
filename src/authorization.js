import fetch from 'node-fetch';
import { Router, Route, Link } from 'react-router'

class Authorization {

  constructor(opts) {
    let { type, key, unlogin } = opts;
    let { redirect, } = unlogin;
    this.type = type;
    this.cookieKey = key;
    this.unloginRedirect = redirect;
  }

  redirect() {

  }
}

export default meta => {
  for (let resource of Object.entries(meta)) {
    let [name, value] = resource;
    meta[name] = new Resource(value);
  }
  return meta;
}
