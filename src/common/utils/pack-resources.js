/**
 * 组装Reources对象，提供组件可调用
 * @param {*} resources 
 * @param {*} resourcesObjs 
 */
export default (resources = [], resourcesObjs = {}) => {
  let reous = {};
  for (let i = 0; i < resources.length; i++) {
    let it = resources[i];
    if (typeof it == 'string') {
      reous[it] = resourcesObjs[it];
    } else if (typeof it == 'object') {
      let [rawKey] = Object.keys(it);
      reous[rawKey] = resourcesObjs[it[rawKey]];
    }
  }
  return reous;
}
