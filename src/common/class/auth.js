
import cookie from 'js-cookie';
import { getConfig } from '../../store';
import getPage from '../utils/get-page';

export default () => {
  let { authorization } = getConfig();
  if (!authorization) {
    return { 'access': true };
  }
  let { key, type, unlogin = {} } = authorization;
 
  let token;
  if (type == 'cookie') {
    token = cookie.get(key);
  } else if (type == 'jwt') {
    token = localStorage.getItem(key);
  }

  if (!token) { // 未找到登录后标识
    let page = getPage(unlogin.redirect);
    return {
      'access': false,
      'path': page.path
    };
  }
  return {
    'access': true
  };
}
