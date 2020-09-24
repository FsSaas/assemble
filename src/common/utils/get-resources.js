import jsonTransform from './json-transform';
import fetch from './fetch';

/**
 * 批量处理 Resources 配置
 * 返回请求处理后的数据
 */
export default (resources = []) => {
  let promises = [];

  for (let i = 0; i < resources.length; i++) {
    let { name, type, uri, value, response } = resources[i];
    let promise = new Promise((resolve, reject) => {
      if (type == 'restful') {
        fetch(uri, {
          'method': 'GET',
          'headers': {
            'content-type': 'application/json'
          }
        }).catch(err => reject(err))
          .then(res => res.json())
          .then(value => {
            resolve({ name, value, response })
          });
      } else if (type == 'static') {
        resolve({ name, value, response })
      }
    });
    promises.push(promise);
  }

  return Promise.all(promises)
    .then(resources => {
      let res = {};
      resources.forEach(it => {
        let { name, value, response } = it;
        // 通过JsonPath格式化接口返回值
        if (response && response.transform) {
          value = jsonTransform(value, response.transform);
        }
        res[name] = value
      });
      return res;
    })
}
