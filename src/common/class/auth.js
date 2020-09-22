
import cookie from 'js-cookie';
import { getConfig } from '../../store';
import getPage from '../utils/get-page';

export default name => {
  let { authorization } = getConfig();
  if (!authorization) {
    return { 'access': true };
  }
  let { 'access-token': accessToken, type, 'un-auth': unauth = {}, 'auth-pages': authPages } = authorization;
  if (!authPages.includes(name)) {
    return { 'access': true };
  }
 
  let token;
  if (type == 'cookie') {
    token = cookie.get(accessToken);
  } else if (type == 'jwt') {
    token = localStorage.getItem(accessToken);
  }

  if (!token) { // 未找到登录后标识
    let page = getPage(unauth.redirect);
    return {
      'access': false,
      'path': page.path
    };
  }

  return {
    'access': true
  };
}
