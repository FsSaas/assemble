
import cookie from 'js-cookie';
import { getConfig } from '../../store';
import getPage from '../utils/get-page';

export default () => {
  let { authorization = {} } = getConfig();
  let { key, type, unlogin = {} } = authorization;

  if (type == 'cookie') {
    const token = cookie.get(key);
    if (!token) { // 未找到登录后标识
      let page = getPage(unlogin.redirect);
      return {
        'access': false,
        'path': page.path
      };
    }
  }
  return {
    'access': true
  };
}
