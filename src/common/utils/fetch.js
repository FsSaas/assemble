import fetch from 'node-fetch';
import { getConfig } from '../../store';
import history from '../../history';
import getPage from '../utils/get-page';

const jwtAuthCache = { 'token': null };

// 缓存 JWT 令牌
const cacheJwtToken = (uri, res) => {
  let { authorization = {} } = getConfig();
  let {
    type,
    'access-token': accessToken,
    'auth-uri': authUri
  } = authorization;
  // 匹配到登录验证接口，缓存令牌
  if (type == 'jwt' && authUri == uri) {
    jwtAuthCache['token'] = res[accessToken];
  }
  return res;
}

export default (uri, opts = {}) => {

  let { authorization } = getConfig();
  if (authorization) {
    // JWT 权限要在每个请求中添加令牌
    if (authorization.type == 'jwt') {
      let { 'access-token': accessToken } = authorization;
      opts.headers = opts.headers || {};
      opts.headers[accessToken] = jwtAuthCache.token;
    }
  }

  return fetch(uri, opts)
    .then(res => res.json())
    .then(res => cacheJwtToken(uri, res))
    .catch(err => {
      if (e.status === 401) {
        let { authorization } = getConfig();
        if (!authorization) throw err;
        let { unlogin = {} } = authorization;
        let { redirect } = unlogin;
        let page = getPage(redirect);
        history.replace(page.path);
      }
    });
}
