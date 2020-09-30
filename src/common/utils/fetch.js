import fetch from 'node-fetch';
import { getConfig } from '../../store';
import history from '../../history';
import getPage from '../utils/get-page';

export default (uri, opts = {}) => {

  let { authorization } = getConfig();
  if (authorization) {
    // JWT 权限要在每个请求中添加令牌
    if (authorization.type == 'jwt') {
      const { 'access-token': accessToken } = authorization;
      const token = localStorage.getItem(accessToken);
      opts.headers = opts.headers || {};
      opts.headers[accessToken] = token;
    }
  }

  return fetch(uri, opts)
    .catch(err => {
      if (err.status === 401) {
        let { authorization } = getConfig();
        if (!authorization) throw err;
        let { 'un-auth': unauth = {} } = authorization;
        let { redirect } = unauth;
        let page = getPage(redirect);
        history.replace(page.path);
      }
      throw err;
    });
}
